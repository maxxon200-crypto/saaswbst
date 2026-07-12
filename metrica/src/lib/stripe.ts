import Stripe from "stripe";
import type { PlanTier } from "./db.types";

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  // Use the SDK's pinned API version.
  return new Stripe(key);
}

// Price ids per paid plan (set in env; annual prices give 2 months free).
export const PRICE_TO_PLAN: Record<string, PlanTier> = {
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_SOLO ?? "price_solo"]: "solo",
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_STUDIO ?? "price_studio"]: "studio",
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_STUDIO_PLUS ?? "price_studio_plus"]: "studio_plus",
};

export const PLAN_TO_PRICE: Record<Exclude<PlanTier, "trial">, string | undefined> = {
  solo: process.env.NEXT_PUBLIC_STRIPE_PRICE_SOLO,
  studio: process.env.NEXT_PUBLIC_STRIPE_PRICE_STUDIO,
  studio_plus: process.env.NEXT_PUBLIC_STRIPE_PRICE_STUDIO_PLUS,
};

export function planForPrice(priceId: string | null | undefined): PlanTier {
  if (!priceId) return "trial";
  return PRICE_TO_PLAN[priceId] ?? "trial";
}
