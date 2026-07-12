import type { PlanTier } from "./db.types";

// Client-safe presentation data (no Stripe import). Tiers are seat-bounded,
// not seat-metered — Metrica does not do per-seat pricing.
export const PLAN_PRICING: {
  tier: Exclude<PlanTier, "trial">;
  name: string;
  price: string;
  seats: string;
  extractions: string;
}[] = [
  { tier: "solo", name: "Solo", price: "€39", seats: "1 seat", extractions: "150 extractions / month" },
  { tier: "studio", name: "Studio", price: "€79", seats: "up to 5 seats", extractions: "600 extractions / month" },
  { tier: "studio_plus", name: "Studio+", price: "€149", seats: "unlimited seats", extractions: "2,000 extractions / month" },
];
