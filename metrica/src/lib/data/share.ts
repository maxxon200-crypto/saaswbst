import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isDemoMode, isSupabaseConfigured } from "@/lib/supabase/config";
import { demoBundle } from "./demo";
import type { ItemStatus } from "@/lib/db.types";

export interface SharedItem {
  id: string;
  room_id: string;
  ref_code: string | null;
  qty: number;
  unit_price: number | null;
  status: ItemStatus;
  client_comment: string | null;
  position: number;
  product: {
    name: string;
    brand: string | null;
    designer: string | null;
    collection: string | null;
    dimensions_raw: string | null;
    finish: string | null;
    image_path: string | null;
    width_mm: number | null;
    depth_mm: number | null;
    height_mm: number | null;
  } | null;
}

export interface SharedData {
  project: { id: string; name: string; client_name: string | null; currency: string };
  studio: { name: string; logo_path: string | null };
  rooms: { id: string; name: string; code: string; position: number }[];
  items: SharedItem[];
}

export async function getSharedProject(token: string): Promise<SharedData | null> {
  if (!isSupabaseConfigured()) {
    if (isDemoMode() && token === "demo-share-token") {
      const b = demoBundle("demo-project");
      if (!b) return null;
      return {
        project: {
          id: b.project.id,
          name: b.project.name,
          client_name: b.project.client_name,
          currency: b.project.currency,
        },
        studio: { name: "Studio Vesper", logo_path: null },
        rooms: b.rooms.map((r) => ({ id: r.id, name: r.name, code: r.code, position: r.position })),
        items: b.items.map((i) => ({
          id: i.id,
          room_id: i.room_id,
          ref_code: i.ref_code,
          qty: i.qty,
          unit_price: i.unit_price,
          status: i.status,
          client_comment: i.client_comment,
          position: i.position,
          product: i.product
            ? {
                name: i.product.name,
                brand: i.product.brand,
                designer: i.product.designer,
                collection: i.product.collection,
                dimensions_raw: i.product.dimensions_raw,
                finish: i.product.finish,
                image_path: i.product.image_path,
                width_mm: i.product.width_mm,
                depth_mm: i.product.depth_mm,
                height_mm: i.product.height_mm,
              }
            : null,
        })),
      };
    }
    return null;
  }

  // Public read via the SECURITY DEFINER function — RLS stays on.
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.rpc("get_shared_project", { p_token: token });
  return (data as SharedData | null) ?? null;
}
