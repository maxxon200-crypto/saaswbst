import type { SupabaseClient } from "@supabase/supabase-js";
import { PLAN_EXTRACTION_QUOTA, type PlanTier } from "@/lib/db.types";

export interface Usage {
  used: number;
  limit: number;
  remaining: number;
  exceeded: boolean;
}

// Trial is a lifetime cap; paid plans reset monthly. (Calendar month is a close
// approximation of the Stripe billing period; refine against the subscription
// anchor in Milestone 7.)
function periodStartISO(plan: PlanTier): string {
  if (plan === "trial") return new Date(0).toISOString();
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  ).toISOString();
}

export async function getUsage(
  supabase: SupabaseClient,
  studioId: string,
  plan: PlanTier,
): Promise<Usage> {
  const limit = PLAN_EXTRACTION_QUOTA[plan];
  const { count } = await supabase
    .from("extractions")
    .select("*", { count: "exact", head: true })
    .eq("studio_id", studioId)
    .eq("success", true)
    .gte("created_at", periodStartISO(plan));
  const used = count ?? 0;
  return { used, limit, remaining: Math.max(0, limit - used), exceeded: used >= limit };
}
