// Hand-authored domain types mirroring supabase/migrations/0001_init.sql.
// (Swap for `supabase gen types typescript` output once a project exists.)

export type MemberRole = "owner" | "member";
export type ProjectStatus = "active" | "archived";
export type ProductSource = "url" | "pdf" | "manual" | "seed";
export type PriceType = "trade" | "retail";
export type ItemStatus = "pending" | "approved" | "rejected";
export type ExtractionMode = "url" | "file";
export type PlanTier = "trial" | "solo" | "studio" | "studio_plus";

export interface Studio {
  id: string;
  name: string;
  logo_path: string | null;
  address: string | null;
  vat_number: string | null;
  default_currency: string;
  default_markup: number;
  plan: PlanTier;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  trial_ends_at: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  studio_id: string;
  name: string;
  client_name: string | null;
  currency: string;
  markup: number;
  status: ProjectStatus;
  share_token: string | null;
  share_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  project_id: string;
  name: string;
  code: string;
  position: number;
  created_at: string;
}

export interface Product {
  id: string;
  studio_id: string | null;
  name: string;
  brand: string | null;
  collection: string | null;
  designer: string | null;
  category: string | null;
  sku: string | null;
  width_mm: number | null;
  depth_mm: number | null;
  height_mm: number | null;
  seat_height_mm: number | null;
  diameter_mm: number | null;
  dimensions_raw: string | null;
  materials: string[];
  finish: string | null;
  colour: string | null;
  price_amount: number | null;
  price_currency: string | null;
  price_type: PriceType | null;
  lead_time_weeks: number | null;
  description_en: string | null;
  description_it: string | null;
  source_url: string | null;
  source_type: ProductSource;
  image_path: string | null;
  created_at: string;
}

export interface ScheduleItem {
  id: string;
  project_id: string;
  room_id: string;
  product_id: string | null;
  ref_code: string | null;
  qty: number;
  unit_price: number | null;
  markup_override: number | null;
  notes: string | null;
  position: number;
  status: ItemStatus;
  client_comment: string | null;
  created_at: string;
}

export const PLAN_LABEL: Record<PlanTier, string> = {
  trial: "Trial",
  solo: "Solo",
  studio: "Studio",
  studio_plus: "Studio+",
};

// Monthly included extractions per plan (enforced server-side in /api/extract).
export const PLAN_EXTRACTION_QUOTA: Record<PlanTier, number> = {
  trial: 15, // total, not monthly (handled in the quota check)
  solo: 150,
  studio: 600,
  studio_plus: 2000,
};
