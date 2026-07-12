import type { ScheduleItemWithProduct } from "@/lib/data/demo";

export interface ProductPricing {
  mode: "trade" | "client" | "none";
  markup: number;
  currency: string;
}

/** Unit price for display: trade is the net price; client applies the markup. */
export function computeUnit(item: ScheduleItemWithProduct, pricing: ProductPricing): number | null {
  const base = item.unit_price ?? item.product?.price_amount ?? null;
  if (base == null) return null;
  if (pricing.mode === "client") {
    const markup = item.markup_override ?? pricing.markup ?? 0;
    return Math.round(base * (1 + markup / 100));
  }
  return base;
}

export function formatPdfMoney(amount: number | null, currency: string): string {
  if (amount == null) return "—";
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString("en-GB")}`;
  }
}
