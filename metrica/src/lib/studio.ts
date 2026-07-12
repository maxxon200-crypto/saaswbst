import { redirect } from "next/navigation";
import type { MemberRole, PlanTier, Studio } from "./db.types";
import { createSupabaseServerClient } from "./supabase/server";
import { isDemoMode, isSupabaseConfigured } from "./supabase/config";

export interface StudioContext {
  studioId: string;
  studioName: string;
  plan: PlanTier;
  role: MemberRole;
  userEmail: string | null;
  isDemo: boolean;
}

const DEMO: StudioContext = {
  studioId: "00000000-0000-0000-0000-000000000000",
  studioName: "Studio Vesper",
  plan: "studio",
  role: "owner",
  userEmail: "you@studiovesper.it",
  isDemo: true,
};

/** Non-redirecting resolver for route handlers. Returns null when unresolved. */
export async function getStudioContextOrNull(): Promise<StudioContext | null> {
  if (!isSupabaseConfigured()) return isDemoMode() ? DEMO : null;

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("studio_members")
    .select("role, studio:studios(*)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (!membership?.studio) return null;

  const studio = membership.studio as unknown as Studio;
  return {
    studioId: studio.id,
    studioName: studio.name,
    plan: studio.plan,
    role: (membership.role as MemberRole) ?? "member",
    userEmail: user.email ?? null,
    isDemo: false,
  };
}

/**
 * Resolves the authenticated user's studio for the app shell. Redirects to
 * /login when there is no session. Falls back to demo data only in local
 * preview (Supabase unconfigured + NEXT_PUBLIC_METRICA_DEMO=1).
 */
export async function getStudioContext(): Promise<StudioContext> {
  if (!isSupabaseConfigured()) {
    if (isDemoMode()) return DEMO;
    redirect("/login");
  }

  const ctx = await getStudioContextOrNull();
  if (ctx) return ctx;

  // Signed in but no studio yet, or no session → bootstrap or send to login.
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.rpc("create_studio", { p_name: "My studio" });
  redirect("/projects");
}
