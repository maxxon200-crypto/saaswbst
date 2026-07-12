/** Formatting helpers. All money/numbers render with tabular figures in the UI. */

export function formatMoney(amount: number | null | undefined, currency = "EUR"): string {
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

export function formatDimensions(d: {
  width_mm: number | null;
  depth_mm: number | null;
  height_mm: number | null;
  diameter_mm?: number | null;
  dimensions_raw?: string | null;
}): string {
  const parts = [d.width_mm, d.depth_mm, d.height_mm].filter(
    (n): n is number => n != null,
  );
  if (parts.length) return `${parts.join(" × ")} mm`;
  if (d.diameter_mm) return `⌀ ${d.diameter_mm} mm`;
  return d.dimensions_raw?.trim() || "—";
}

export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}
