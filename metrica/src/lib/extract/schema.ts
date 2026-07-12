import { z } from "zod";

/**
 * The exact shape Claude must return (see prompt.ts). Numbers are coerced
 * leniently (the model may emit "2420 mm" or "" for unknown), and unknown
 * numerics normalise to null — never a plausible invention.
 */
/**
 * Parse a possibly-messy numeric string, disambiguating European ("2.180" =
 * 2180, "1.234,56") from US ("1,234.56") separators. Prefers null over a
 * wrong guess — a 1000×-off price is worse than a blank the designer fills in.
 */
function parseNumish(input: string): number | null {
  let s = input.replace(/[^0-9.,\-]/g, "").trim();
  if (!s) return null;

  const hasDot = s.includes(".");
  const hasComma = s.includes(",");

  if (hasDot && hasComma) {
    // The rightmost separator is the decimal; the other is thousands.
    if (s.lastIndexOf(",") > s.lastIndexOf(".")) {
      s = s.replace(/\./g, "").replace(",", "."); // 1.234,56 -> 1234.56
    } else {
      s = s.replace(/,/g, ""); // 1,234.56 -> 1234.56
    }
  } else if (hasComma) {
    const tail = s.split(",").pop() ?? "";
    s = tail.length === 3 ? s.replace(/,/g, "") : s.replace(",", ".");
  } else if (hasDot) {
    const parts = s.split(".");
    const tail = parts[parts.length - 1] ?? "";
    // A single dot with exactly 3 trailing digits is a European thousands
    // separator (2.180 -> 2180); otherwise it is a decimal point.
    if (parts.length === 2 && tail.length === 3) s = s.replace(/\./g, "");
  }

  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

const numish = z.preprocess((v) => {
  if (v === "" || v === null || v === undefined) return null;
  if (typeof v === "string") return parseNumish(v);
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  return null;
}, z.number().nullable());

const str = z.preprocess(
  (v) => (v === null || v === undefined ? "" : v),
  z.string(),
);

export const dimensionsSchema = z.object({
  width_mm: numish,
  depth_mm: numish,
  height_mm: numish,
  seat_height_mm: numish,
  diameter_mm: numish,
  raw: str.default(""),
});

export const productSchema = z.object({
  name: str.default(""),
  brand: str.default(""),
  collection: str.default(""),
  designer: str.default(""),
  category: str.default(""),
  sku: str.default(""),
  dimensions: dimensionsSchema,
  materials: z.preprocess(
    (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.trim()) : []),
    z.array(z.string()),
  ).default([]),
  finish: str.default(""),
  colour: str.default(""),
  price: z.object({
    amount: numish,
    currency: str.default("EUR"),
    type: z.preprocess(
      (v) => (v === "retail" ? "retail" : "trade"),
      z.enum(["trade", "retail"]),
    ).default("trade"),
  }),
  lead_time_weeks: numish,
  description_en: str.default(""),
  description_it: str.default(""),
  source_url: str.default(""),
  image_url: str.default(""),
});

export const extractionSchema = z.object({
  confidence: z.preprocess(
    (v) => (v === "high" || v === "medium" || v === "low" ? v : "low"),
    z.enum(["high", "medium", "low"]),
  ),
  uncertain_fields: z.preprocess(
    (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string") : []),
    z.array(z.string()),
  ).default([]),
  product: productSchema,
});

export type ExtractionResult = z.infer<typeof extractionSchema>;
export type ExtractedProduct = z.infer<typeof productSchema>;
