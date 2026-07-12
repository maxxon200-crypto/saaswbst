import type { Product, Project, Room, ScheduleItem } from "@/lib/db.types";

export interface ScheduleItemWithProduct extends ScheduleItem {
  product: Product | null;
}

export interface ProjectBundle {
  project: Project;
  rooms: Room[];
  items: ScheduleItemWithProduct[];
}

export interface ProjectListRow {
  id: string;
  name: string;
  client_name: string | null;
  itemCount: number;
  value: number;
  currency: string;
  status: Project["status"];
  updated_at: string;
}

const STUDIO = "00000000-0000-0000-0000-000000000000";

function product(p: Partial<Product> & { id: string; name: string }): Product {
  return {
    id: p.id,
    studio_id: null,
    name: p.name,
    brand: p.brand ?? null,
    collection: p.collection ?? null,
    designer: p.designer ?? null,
    category: p.category ?? null,
    sku: p.sku ?? null,
    width_mm: p.width_mm ?? null,
    depth_mm: p.depth_mm ?? null,
    height_mm: p.height_mm ?? null,
    seat_height_mm: p.seat_height_mm ?? null,
    diameter_mm: p.diameter_mm ?? null,
    dimensions_raw: p.dimensions_raw ?? null,
    materials: p.materials ?? [],
    finish: p.finish ?? null,
    colour: p.colour ?? null,
    price_amount: p.price_amount ?? null,
    price_currency: p.price_currency ?? "EUR",
    price_type: p.price_type ?? "trade",
    lead_time_weeks: p.lead_time_weeks ?? null,
    description_en: p.description_en ?? null,
    description_it: p.description_it ?? null,
    source_url: p.source_url ?? null,
    source_type: p.source_type ?? "seed",
    image_path: p.image_path ?? null,
    created_at: "2026-05-01T00:00:00Z",
  };
}

const P = {
  camaleonda: product({
    id: "p-cam", name: "Camaleonda", brand: "B&B Italia", designer: "Mario Bellini",
    category: "Seating", width_mm: 2420, depth_mm: 1080, height_mm: 620, seat_height_mm: 330,
    dimensions_raw: "242 × 108 × 62 cm", materials: ["Bouclé", "Down"], finish: "Ecru bouclé",
    price_amount: 9240, lead_time_weeks: 10,
  }),
  arco: product({
    id: "p-arco", name: "Arco", brand: "Flos", designer: "Achille Castiglioni",
    category: "Lighting", height_mm: 2400, dimensions_raw: "H 240 cm, reach 200 cm",
    materials: ["Carrara marble", "Stainless steel"], finish: "Polished steel",
    price_amount: 2180, lead_time_weeks: 3,
  }),
  nuvola: product({
    id: "p-nuv", name: "Nuvola Rossa", brand: "Cassina", designer: "Vico Magistretti",
    category: "Storage", width_mm: 1900, depth_mm: 390, height_mm: 1930,
    dimensions_raw: "190 × 39 × 193 cm", materials: ["Ash"], finish: "Natural ash",
    price_amount: 3760, lead_time_weeks: 6,
  }),
  lc4: product({
    id: "p-lc4", name: "LC4 Chaise Longue", brand: "Cassina", designer: "Le Corbusier",
    category: "Seating", width_mm: 1600, depth_mm: 560, height_mm: 700,
    dimensions_raw: "160 × 56 × 70 cm", materials: ["Chromed steel", "Leather"], finish: "Black leather",
    price_amount: 4100, lead_time_weeks: 8,
  }),
  tolomeo: product({
    id: "p-tol", name: "Tolomeo Tavolo", brand: "Artemide", designer: "Michele De Lucchi",
    category: "Lighting", height_mm: 900, dimensions_raw: "H max 90 cm",
    materials: ["Aluminium"], finish: "Natural aluminium", price_amount: 260, lead_time_weeks: 0,
  }),
  componibili: product({
    id: "p-comp", name: "Componibili", brand: "Kartell", designer: "Anna Castelli Ferrieri",
    category: "Storage", diameter_mm: 320, height_mm: 585, dimensions_raw: "⌀ 32 × H 58.5 cm",
    materials: ["ABS"], finish: "Matte white", price_amount: 155, lead_time_weeks: 0,
  }),
};

function item(
  i: {
    id: string; room_id: string; product: Product; ref: string; qty: number;
    position: number; status?: ScheduleItem["status"]; comment?: string | null;
  },
): ScheduleItemWithProduct {
  return {
    id: i.id, project_id: "demo-project", room_id: i.room_id, product_id: i.product.id,
    ref_code: i.ref, qty: i.qty, unit_price: i.product.price_amount, markup_override: null,
    notes: null, position: i.position, status: i.status ?? "pending",
    client_comment: i.comment ?? null, created_at: "2026-06-01T00:00:00Z", product: i.product,
  };
}

const ROOMS: Room[] = [
  { id: "r-lr", project_id: "demo-project", name: "Living", code: "LR", position: 0, created_at: "" },
  { id: "r-kit", project_id: "demo-project", name: "Kitchen", code: "KIT", position: 1, created_at: "" },
  { id: "r-br", project_id: "demo-project", name: "Bedroom", code: "BR", position: 2, created_at: "" },
];

const ITEMS: ScheduleItemWithProduct[] = [
  item({ id: "i1", room_id: "r-lr", product: P.camaleonda, ref: "LR-01", qty: 1, position: 0, status: "approved" }),
  item({ id: "i2", room_id: "r-lr", product: P.arco, ref: "LR-02", qty: 1, position: 1, status: "approved" }),
  item({ id: "i3", room_id: "r-lr", product: P.nuvola, ref: "LR-03", qty: 1, position: 2, status: "pending" }),
  item({ id: "i4", room_id: "r-lr", product: P.lc4, ref: "LR-04", qty: 1, position: 3, status: "rejected", comment: "Client prefers the fabric version." }),
  item({ id: "i5", room_id: "r-kit", product: P.tolomeo, ref: "KIT-01", qty: 2, position: 0, status: "pending" }),
  item({ id: "i6", room_id: "r-br", product: P.componibili, ref: "BR-01", qty: 2, position: 0, status: "approved" }),
];

const PROJECT: Project = {
  id: "demo-project", studio_id: STUDIO, name: "Palazzo Rézzonico", client_name: "Ospiti · Dorsoduro",
  currency: "EUR", markup: 0, status: "active", share_token: "demo-share-token", share_enabled: true,
  created_at: "2026-05-01T00:00:00Z", updated_at: "2026-07-02T00:00:00Z",
};

export function demoProjectList(): ProjectListRow[] {
  const value = ITEMS.reduce((s, it) => s + (it.unit_price ?? 0) * it.qty, 0);
  return [
    {
      id: PROJECT.id, name: PROJECT.name, client_name: PROJECT.client_name,
      itemCount: ITEMS.length, value, currency: PROJECT.currency, status: PROJECT.status,
      updated_at: PROJECT.updated_at,
    },
    {
      id: "demo-2", name: "Attico Brera", client_name: "Riva Holdings",
      itemCount: 0, value: 0, currency: "EUR", status: "active", updated_at: "2026-06-20T00:00:00Z",
    },
  ];
}

export function demoBundle(id: string): ProjectBundle | null {
  if (id !== PROJECT.id && id !== "demo-2") return null;
  if (id === "demo-2") {
    return {
      project: { ...PROJECT, id: "demo-2", name: "Attico Brera", client_name: "Riva Holdings" },
      rooms: [{ id: "r2-lr", project_id: "demo-2", name: "Living", code: "LR", position: 0, created_at: "" }],
      items: [],
    };
  }
  return { project: PROJECT, rooms: ROOMS, items: ITEMS };
}
