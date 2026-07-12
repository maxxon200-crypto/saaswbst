import "server-only";
import { getUsage, type Usage } from "@/lib/extract/quota";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isDemoMode, isSupabaseConfigured } from "@/lib/supabase/config";
import { PLAN_EXTRACTION_QUOTA } from "@/lib/db.types";
import type { StudioContext } from "@/lib/studio";

export async function getStudioUsage(ctx: StudioContext): Promise<Usage> {
  if (!isSupabaseConfigured()) {
    const limit = PLAN_EXTRACTION_QUOTA[ctx.plan];
    const used = isDemoMode() ? 128 : 0;
    return { used, limit, remaining: Math.max(0, limit - used), exceeded: used >= limit };
  }
  const supabase = createSupabaseServerClient();
  return getUsage(supabase, ctx.studioId, ctx.plan);
}
