// Hand-authored domain types mirroring supabase/migrations/0001_init.sql.
// (Swap for `supabase gen types typescript` output once a project exists.)

export type MemberRole = "owner" | "member";
export type ProjectStatus = "active" | "archived";
export type ProductSource = "url" | "pdf" | "manual" | "seed";
export type PriceType = "trade" | "retail";
export type ExtractionMode = "url" | "file";
export type PlanTier = "trial" | "solo" | "studio" | "studio_plus";

// The full item lifecycle, from selection to installed. (Kept named ItemStatus
// so existing imports don't churn; 'selected' subsumes the old 'pending'.)
export type ItemStatus =
  | "selected"
  | "approved"
  | "rejected"
  | "ordered"
  | "in_production"
  | "shipped"
  | "delivered"
  | "installed";

// The only transitions the public client-approval link may make.
export type ClientDecision = Extract<ItemStatus, "approved" | "rejected">;

export const ITEM_STATUS_LABEL: Record<ItemStatus, string> = {
  selected: "Selected",
  approved: "Approved",
  rejected: "Rejected",
  ordered: "Ordered",
  in_production: "In production",
  shipped: "Shipped",
  delivered: "Delivered",
  installed: "Installed",
};

// Display order for status dropdowns / grouped boards.
export const ITEM_STATUS_ORDER: ItemStatus[] = [
  "selected",
  "approved",
  "rejected",
  "ordered",
  "in_production",
  "shipped",
  "delivered",
  "installed",
];

export type PoStatus = "draft" | "sent" | "confirmed" | "fulfilled";
export type ClaimStatus = "open" | "submitted" | "accepted" | "rejected" | "resolved";
export type InvoiceStatus = "draft" | "sent" | "viewed" | "paid" | "overdue";

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
  // v2 operations pivot
  supplier_name: string | null;
  cost: number | null;
  markup_pct: number | null;
  client_price: number | null;
  expected_date: string | null;
  actual_date: string | null;
  purchase_order_id: string | null;
}

export interface PurchaseOrder {
  id: string;
  studio_id: string;
  project_id: string;
  supplier_name: string;
  supplier_email: string | null;
  po_number: string;
  status: PoStatus;
  sent_at: string | null;
  confirmed_at: string | null;
  expected_ship_date: string | null;
  total_cost: number | null;
  currency: string;
  pdf_path: string | null;
  created_at: string;
}

export interface PoItem {
  id: string;
  purchase_order_id: string;
  schedule_item_id: string | null;
  qty: number;
  unit_cost: number | null;
  line_total: number | null;
}

export interface Claim {
  id: string;
  studio_id: string;
  project_id: string;
  schedule_item_id: string | null;
  purchase_order_id: string | null;
  description: string | null;
  photo_paths: string[];
  supplier_name: string | null;
  status: ClaimStatus;
  hours_spent: number;
  resolution_notes: string | null;
  created_at: string;
  resolved_at: string | null;
}

export interface ClientInvoice {
  id: string;
  studio_id: string;
  project_id: string;
  stripe_invoice_id: string | null;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
}

/** client_price − cost, in currency units and as a percentage of client_price. */
export function lineMargin(item: Pick<ScheduleItem, "cost" | "client_price">): {
  amount: number | null;
  pct: number | null;
} {
  if (item.cost == null || item.client_price == null) return { amount: null, pct: null };
  const amount = item.client_price - item.cost;
  const pct = item.client_price === 0 ? null : (amount / item.client_price) * 100;
  return { amount, pct };
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
