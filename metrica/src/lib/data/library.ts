import "server-only";
import type { Product } from "@/lib/db.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isDemoMode, isSupabaseConfigured } from "@/lib/supabase/config";
import seed from "../../../supabase/seed/products.json";

type SeedEntry = {
  name: string; brand?: string; collection?: string; designer?: string; category?: string;
  width_mm?: number; depth_mm?: number; height_mm?: number; seat_height_mm?: number; diameter_mm?: number;
  materials?: string[]; finish?: string; colour?: string; price_amount?: number;
  price_currency?: string; price_type?: "trade" | "retail"; lead_time_weeks?: number;
  description_en?: string; description_it?: string;
};

function seedProducts(): Product[] {
  return (seed.products as SeedEntry[]).map((p, i) => ({
    id: `seed-${i}`,
    studio_id: null,
    name: p.name,
    brand: p.brand ?? null,
    collection: p.collection ?? null,
    designer: p.designer ?? null,
    category: p.category ?? null,
    sku: null,
    width_mm: p.width_mm ?? null,
    depth_mm: p.depth_mm ?? null,
    height_mm: p.height_mm ?? null,
    seat_height_mm: p.seat_height_mm ?? null,
    diameter_mm: p.diameter_mm ?? null,
    dimensions_raw: null,
    materials: p.materials ?? [],
    finish: p.finish ?? null,
    colour: p.colour ?? null,
    price_amount: p.price_amount ?? null,
    price_currency: p.price_currency ?? "EUR",
    price_type: p.price_type ?? "trade",
    lead_time_weeks: p.lead_time_weeks ?? null,
    description_en: p.description_en ?? null,
    description_it: p.description_it ?? null,
    source_url: null,
    source_type: "seed",
    image_path: null,
    created_at: "2026-01-01T00:00:00Z",
  }));
}

/** All library products the studio can see (global seed + its own). */
export async function listLibrary(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return isDemoMode() ? seedProducts() : [];

  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("brand", { ascending: true })
    .order("name", { ascending: true });
  return (data ?? []) as Product[];
}
