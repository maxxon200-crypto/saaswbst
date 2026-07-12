import { NextResponse } from "next/server";
import { getStripe, stripeConfigured, PLAN_TO_PRICE } from "@/lib/stripe";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getStudioContextOrNull } from "@/lib/studio";
import type { PlanTier } from "@/lib/db.types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!stripeConfigured() || !isSupabaseConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as { plan?: PlanTier } | null;
  const plan = body?.plan;
  const price = plan && plan !== "trial" ? PLAN_TO_PRICE[plan] : undefined;
  if (!price) return NextResponse.json({ error: "invalid_plan" }, { status: 400 });

  const ctx = await getStudioContextOrNull();
  if (!ctx) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();
  const { data: studio } = await admin
    .from("studios")
    .select("id, name, stripe_customer_id")
    .eq("id", ctx.studioId)
    .single();
  if (!studio) return NextResponse.json({ error: "no_studio" }, { status: 404 });

  const stripe = getStripe();
  let customerId: string | null = studio.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: ctx.userEmail ?? undefined,
      name: studio.name,
      metadata: { studio_id: studio.id },
    });
    customerId = customer.id;
    await admin.from("studios").update({ stripe_customer_id: customerId }).eq("id", studio.id);
  }

  const base = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price, quantity: 1 }],
    // Stripe Tax for EU VAT.
    automatic_tax: { enabled: true },
    customer_update: { address: "auto", name: "auto" },
    tax_id_collection: { enabled: true },
    allow_promotion_codes: true,
    subscription_data: { metadata: { studio_id: studio.id } },
    success_url: `${base}/settings?billing=success`,
    cancel_url: `${base}/settings?billing=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
