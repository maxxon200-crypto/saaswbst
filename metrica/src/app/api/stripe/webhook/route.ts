import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, planForPrice, stripeConfigured } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// Stripe webhooks: keep studios.plan in sync with the subscription.
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeConfigured() || !secret) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const stripe = getStripe();
  const sig = request.headers.get("stripe-signature");
  const raw = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig ?? "", secret);
  } catch (e) {
    return NextResponse.json(
      { error: `signature: ${e instanceof Error ? e.message : "invalid"}` },
      { status: 400 },
    );
  }

  const admin = createSupabaseAdminClient();

  async function syncFromSubscription(sub: Stripe.Subscription) {
    const priceId = sub.items.data[0]?.price.id;
    const active = sub.status === "active" || sub.status === "trialing";
    const plan = active ? planForPrice(priceId) : "trial";
    await admin
      .from("studios")
      .update({ plan, stripe_subscription_id: sub.id })
      .eq("stripe_customer_id", sub.customer as string);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        await syncFromSubscription(sub);
      }
      break;
    }
    case "customer.subscription.updated": {
      await syncFromSubscription(event.data.object as Stripe.Subscription);
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await admin
        .from("studios")
        .update({ plan: "trial", stripe_subscription_id: null })
        .eq("stripe_customer_id", sub.customer as string);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
