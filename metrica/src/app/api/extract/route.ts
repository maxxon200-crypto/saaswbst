import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { anthropicConfigured, runExtraction } from "@/lib/extract/claude";
import { fileBlocks, urlBlocks } from "@/lib/extract/sources";
import { getUsage } from "@/lib/extract/quota";
import { ExtractError, errorStatus, type ExtractErrorCode } from "@/lib/extract/errors";
import type { PlanTier } from "@/lib/db.types";

export const runtime = "nodejs";
export const maxDuration = 60;

const EXTRACTION_TIMEOUT_MS = 45_000;

const bodySchema = z
  .object({
    mode: z.enum(["url", "file"]),
    url: z.string().url().optional(),
    file_path: z.string().min(1).optional(),
    project_id: z.string().uuid(),
  })
  .refine((b) => (b.mode === "url" ? Boolean(b.url) : Boolean(b.file_path)), {
    message: "Provide a url for mode 'url' or file_path for mode 'file'.",
  });

function fail(code: ExtractErrorCode, message: string) {
  return NextResponse.json({ error: code, message }, { status: errorStatus(code) });
}

export async function POST(request: Request) {
  // The Anthropic key lives ONLY here (server). Never shipped to the client.
  if (!isSupabaseConfigured() || !anthropicConfigured()) {
    return fail(
      "not_configured",
      "Extraction is not configured in this environment (Supabase + ANTHROPIC_API_KEY required).",
    );
  }

  // 1 — validate input
  const parsedBody = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsedBody.success) {
    return fail("invalid_input", parsedBody.error.issues[0]?.message ?? "Invalid request.");
  }
  const { mode, url, file_path, project_id } = parsedBody.data;

  // 2 — authenticated session
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return fail("unauthorized", "Sign in to extract products.");

  // 3 — resolve the project's studio + plan (RLS scopes this to the user)
  const { data: project } = await supabase
    .from("projects")
    .select("id, studio_id, studios(plan)")
    .eq("id", project_id)
    .maybeSingle();
  if (!project) return fail("unauthorized", "Project not found.");

  const studioId = project.studio_id as string;
  const plan = ((project.studios as { plan?: PlanTier } | null)?.plan ??
    "trial") as PlanTier;

  // 4 — quota (enforced server-side; never trust the client)
  const usage = await getUsage(supabase, studioId, plan);
  if (usage.exceeded) {
    return NextResponse.json(
      {
        error: "quota_exceeded" satisfies ExtractErrorCode,
        message: `You have used all ${usage.limit} extractions for this period.`,
        usage: { used: usage.used, limit: usage.limit, remaining: 0 },
      },
      { status: errorStatus("quota_exceeded") },
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), EXTRACTION_TIMEOUT_MS);

  try {
    // 5 — assemble source content (typed fetch_failed / file_failed on problems)
    const blocks =
      mode === "url" ? await urlBlocks(url!) : await fileBlocks(file_path!);

    // 6 — call Claude, strict JSON, one retry
    const { result, usage: tokens } = await runExtraction(blocks, {
      signal: controller.signal,
    });

    // 7 — record the (successful) extraction for quota + analytics
    await supabase.from("extractions").insert({
      studio_id: studioId,
      user_id: user.id,
      mode,
      source: mode === "url" ? url : file_path,
      success: true,
      confidence: result.confidence,
      tokens_in: tokens.tokensIn,
      tokens_out: tokens.tokensOut,
    });

    return NextResponse.json({
      result,
      usage: {
        used: usage.used + 1,
        limit: usage.limit,
        remaining: Math.max(0, usage.remaining - 1),
      },
    });
  } catch (e) {
    // Log the failure for analytics but DO NOT consume quota (success = false).
    await supabase
      .from("extractions")
      .insert({
        studio_id: studioId,
        user_id: user.id,
        mode,
        source: mode === "url" ? url : file_path,
        success: false,
        confidence: null,
      })
      .then(
        () => undefined,
        () => undefined,
      );

    if (e instanceof ExtractError) return fail(e.code, e.message);
    return fail("anthropic_error", e instanceof Error ? e.message : "Extraction failed.");
  } finally {
    clearTimeout(timer);
  }
}
