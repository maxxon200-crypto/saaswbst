import { NextResponse } from "next/server";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getStudioContextOrNull } from "@/lib/studio";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!stripeConfigured() || !isSupabaseConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const ctx = await getStudioContextOrNull();
  if (!ctx) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();
  const { data: studio } = await admin
    .from("studios")
    .select("stripe_customer_id")
    .eq("id", ctx.studioId)
    .single();
  if (!studio?.stripe_customer_id) {
    return NextResponse.json({ error: "no_customer" }, { status: 400 });
  }

  const base = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const session = await getStripe().billingPortal.sessions.create({
    customer: studio.stripe_customer_id,
    return_url: `${base}/settings`,
  });

  return NextResponse.json({ url: session.url });
}
