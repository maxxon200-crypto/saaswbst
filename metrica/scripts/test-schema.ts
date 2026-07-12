// Contract-handling test. Run: node --experimental-strip-types scripts/test-schema.ts
// Verifies fence-stripping + lenient coercion of the Claude extraction contract.
import { extractionSchema } from "../src/lib/extract/schema.ts";

function stripToJson(text: string): string {
  let t = text.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence?.[1]) t = fence[1].trim();
  const first = t.indexOf("{");
  const last = t.lastIndexOf("}");
  if (first !== -1 && last > first) t = t.slice(first, last + 1);
  return t;
}

let failed = 0;
function check(name: string, cond: boolean) {
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}`);
  if (!cond) failed++;
}

// 1) Fenced JSON with string dimensions, null price, only-EN description.
const fenced = "Here you go:\n```json\n" +
  JSON.stringify({
    confidence: "high",
    uncertain_fields: ["price"],
    product: {
      name: "Camaleonda", brand: "B&B Italia", collection: "", designer: "Mario Bellini",
      category: "Seating", sku: "",
      dimensions: { width_mm: "2420", depth_mm: "1080", height_mm: "620", seat_height_mm: "330", diameter_mm: "", raw: "W 242 cm × D 108 cm" },
      materials: ["Bouclé", "Down"], finish: "Ecru bouclé", colour: "Ecru",
      price: { amount: "", currency: "EUR", type: "trade" },
      lead_time_weeks: "10", description_en: "Modular seating.", description_it: "",
      source_url: "https://bebitalia.com/camaleonda", image_url: "",
    },
  }) + "\n```";

const p1 = extractionSchema.safeParse(JSON.parse(stripToJson(fenced)));
check("fenced JSON parses", p1.success);
if (p1.success) {
  check("string '2420' -> number 2420", p1.data.product.dimensions.width_mm === 2420);
  check("empty diameter -> null", p1.data.product.dimensions.diameter_mm === null);
  check("empty price amount -> null (no invention)", p1.data.product.price.amount === null);
  check("raw dimension string preserved", p1.data.product.dimensions.raw === "W 242 cm × D 108 cm");
  check("uncertain_fields carried", p1.data.uncertain_fields.includes("price"));
  check("lead_time '10' -> 10", p1.data.product.lead_time_weeks === 10);
}

// 2) Messy currency-suffixed price string coerces to a number.
const p2 = extractionSchema.safeParse({
  confidence: "medium", uncertain_fields: [],
  product: {
    name: "Arco", brand: "Flos",
    dimensions: { width_mm: null, depth_mm: null, height_mm: "2400", seat_height_mm: null, diameter_mm: null, raw: "H 240 cm" },
    materials: [], finish: "", colour: "",
    price: { amount: "€ 2.180", currency: "EUR", type: "retail" },
    lead_time_weeks: null, description_en: "", description_it: "",
    source_url: "", image_url: "",
  },
});
check("second payload parses", p2.success);
if (p2.success) {
  check("'€ 2.180' -> 2180", p2.data.product.price.amount === 2180);
  check("price type retail preserved", p2.data.product.price.type === "retail");
}

// 3) Garbage confidence normalises to a safe 'low' rather than throwing.
const p3 = extractionSchema.safeParse({
  confidence: "pretty sure", uncertain_fields: "oops",
  product: { name: "X", dimensions: { raw: "" }, price: {} },
});
check("bad confidence normalises to low", p3.success && p3.data.confidence === "low");
check("bad uncertain_fields -> []", p3.success && Array.isArray(p3.data.uncertain_fields));

console.log(failed === 0 ? "\nALL PASSED" : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
