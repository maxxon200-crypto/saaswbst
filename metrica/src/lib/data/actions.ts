"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isDemoMode, isSupabaseConfigured } from "@/lib/supabase/config";
import { getStudioContextOrNull } from "@/lib/studio";
import type { ExtractionResult } from "@/lib/extract/schema";
import type { ItemStatus, ProductSource } from "@/lib/db.types";

export type ActionResult<T = undefined> =
  | ({ ok: true } & (T extends undefined ? {} : { data: T }))
  | { ok: false; error: string };

const DEFAULT_ROOMS = [
  { name: "Living", code: "LR" },
  { name: "Kitchen", code: "KIT" },
  { name: "Bedroom", code: "BR" },
];

function guarded(): "demo" | "unconfigured" | "live" {
  if (isSupabaseConfigured()) return "live";
  return isDemoMode() ? "demo" : "unconfigured";
}

export async function createProject(input: {
  name: string;
  client_name?: string;
  currency?: string;
  markup?: number;
}): Promise<ActionResult<{ id: string }>> {
  const mode = guarded();
  if (mode === "demo") return { ok: true, data: { id: "demo-project" } };
  if (mode === "unconfigured") return { ok: false, error: "Not configured." };
  if (!input.name.trim()) return { ok: false, error: "Name is required." };

  const supabase = createSupabaseServerClient();
  const { data: studioIds } = await supabase.rpc("auth_studio_ids");
  const studioId = Array.isArray(studioIds) ? studioIds[0] : undefined;
  if (!studioId) return { ok: false, error: "No studio." };

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      studio_id: studioId,
      name: input.name.trim(),
      client_name: input.client_name?.trim() || null,
      currency: input.currency || "EUR",
      markup: input.markup ?? 0,
    })
    .select("id")
    .single();
  if (error || !project) return { ok: false, error: error?.message ?? "Failed." };

  await supabase.from("rooms").insert(
    DEFAULT_ROOMS.map((r, i) => ({
      project_id: project.id,
      name: r.name,
      code: r.code,
      position: i,
    })),
  );

  revalidatePath("/projects");
  return { ok: true, data: { id: project.id } };
}

export async function updateItem(
  itemId: string,
  projectId: string,
  patch: { qty?: number; unit_price?: number | null; notes?: string | null },
): Promise<ActionResult> {
  const mode = guarded();
  if (mode !== "live") return mode === "demo" ? { ok: true } : { ok: false, error: "Not configured." };

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("schedule_items").update(patch).eq("id", itemId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/projects/${projectId}`);
  return { ok: true };
}

export async function deleteItem(itemId: string, projectId: string): Promise<ActionResult> {
  const mode = guarded();
  if (mode !== "live") return mode === "demo" ? { ok: true } : { ok: false, error: "Not configured." };

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("schedule_items").delete().eq("id", itemId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/projects/${projectId}`);
  return { ok: true };
}

export async function addRoom(
  projectId: string,
  name: string,
): Promise<ActionResult<{ id: string }>> {
  const mode = guarded();
  if (mode !== "live") return mode === "demo" ? { ok: true, data: { id: "demo-room" } } : { ok: false, error: "Not configured." };

  const supabase = createSupabaseServerClient();
  const code = name.trim().slice(0, 3).toUpperCase() || "RM";
  const { count } = await supabase
    .from("rooms")
    .select("*", { count: "exact", head: true })
    .eq("project_id", projectId);
  const { data, error } = await supabase
    .from("rooms")
    .insert({ project_id: projectId, name: name.trim(), code, position: count ?? 0 })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Failed." };
  revalidatePath(`/projects/${projectId}`);
  return { ok: true, data: { id: data.id } };
}

/** Persist a reviewed extraction: create the product, then a schedule item. */
export async function addItemFromExtraction(input: {
  projectId: string;
  roomId: string;
  roomCode: string;
  result: ExtractionResult;
  source: ProductSource;
  saveToLibrary: boolean;
}): Promise<ActionResult<{ id: string }>> {
  const mode = guarded();
  if (mode !== "live") return mode === "demo" ? { ok: true, data: { id: "demo-item" } } : { ok: false, error: "Not configured." };

  const supabase = createSupabaseServerClient();
  const { data: project } = await supabase
    .from("projects")
    .select("studio_id")
    .eq("id", input.projectId)
    .maybeSingle();
  if (!project) return { ok: false, error: "Project not found." };

  const p = input.result.product;
  const { data: product, error: pErr } = await supabase
    .from("products")
    .insert({
      studio_id: project.studio_id,
      name: p.name || "Untitled",
      brand: p.brand || null,
      collection: p.collection || null,
      designer: p.designer || null,
      category: p.category || null,
      sku: p.sku || null,
      width_mm: p.dimensions.width_mm,
      depth_mm: p.dimensions.depth_mm,
      height_mm: p.dimensions.height_mm,
      seat_height_mm: p.dimensions.seat_height_mm,
      diameter_mm: p.dimensions.diameter_mm,
      dimensions_raw: p.dimensions.raw || null,
      materials: p.materials,
      finish: p.finish || null,
      colour: p.colour || null,
      price_amount: p.price.amount,
      price_currency: p.price.currency || "EUR",
      price_type: p.price.type,
      lead_time_weeks: p.lead_time_weeks,
      description_en: p.description_en || null,
      description_it: p.description_it || null,
      source_url: p.source_url || null,
      source_type: input.source,
    })
    .select("id, price_amount")
    .single();
  if (pErr || !product) return { ok: false, error: pErr?.message ?? "Failed to save product." };

  const { count } = await supabase
    .from("schedule_items")
    .select("*", { count: "exact", head: true })
    .eq("room_id", input.roomId);
  const ref = `${input.roomCode}-${String((count ?? 0) + 1).padStart(2, "0")}`;

  const { data: itemRow, error: iErr } = await supabase
    .from("schedule_items")
    .insert({
      project_id: input.projectId,
      room_id: input.roomId,
      product_id: product.id,
      ref_code: ref,
      qty: 1,
      unit_price: product.price_amount,
      position: count ?? 0,
    })
    .select("id")
    .single();
  if (iErr || !itemRow) return { ok: false, error: iErr?.message ?? "Failed to add to schedule." };

  revalidatePath(`/projects/${input.projectId}`);
  return { ok: true, data: { id: itemRow.id } };
}

/**
 * GDPR account deletion — genuinely removes the studio's Storage objects and
 * every row (studios cascade deletes projects, rooms, items, products, members,
 * extractions), then deletes the auth user. Owner only.
 */
export async function deleteAccount(): Promise<ActionResult> {
  const mode = guarded();
  if (mode !== "live") {
    return { ok: false, error: mode === "demo" ? "Disabled in the demo." : "Not configured." };
  }

  const ctx = await getStudioContextOrNull();
  if (!ctx) return { ok: false, error: "Not signed in." };
  if (ctx.role !== "owner") return { ok: false, error: "Only the studio owner can delete the account." };

  const admin = createSupabaseAdminClient();
  for (const bucket of ["product-images", "source-files", "studio-logos"]) {
    const { data: files } = await admin.storage.from(bucket).list(ctx.studioId);
    if (files?.length) {
      await admin.storage.from(bucket).remove(files.map((f) => `${ctx.studioId}/${f.name}`));
    }
  }
  await admin.from("studios").delete().eq("id", ctx.studioId);

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) await admin.auth.admin.deleteUser(user.id);

  return { ok: true };
}

/** Enable sharing for a project and return the public approval URL. */
export async function createShareLink(
  projectId: string,
): Promise<ActionResult<{ url: string }>> {
  const mode = guarded();
  const base = process.env.NEXT_PUBLIC_APP_URL || "";
  if (mode === "demo") return { ok: true, data: { url: `${base}/share/demo-share-token` } };
  if (mode === "unconfigured") return { ok: false, error: "Not configured." };

  const supabase = createSupabaseServerClient();
  const { data: proj } = await supabase
    .from("projects")
    .select("share_token")
    .eq("id", projectId)
    .maybeSingle();
  const token = proj?.share_token ?? crypto.randomUUID();
  const { error } = await supabase
    .from("projects")
    .update({ share_enabled: true, share_token: token })
    .eq("id", projectId);
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: { url: `${base}/share/${token}` } };
}

/** Revoke a project's share link. */
export async function revokeShareLink(projectId: string): Promise<ActionResult> {
  const mode = guarded();
  if (mode !== "live") return mode === "demo" ? { ok: true } : { ok: false, error: "Not configured." };
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("projects")
    .update({ share_enabled: false })
    .eq("id", projectId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Add an existing library product to a project's first room. */
export async function addLibraryProductToProject(
  productId: string,
  projectId: string,
): Promise<ActionResult<{ id: string }>> {
  const mode = guarded();
  if (mode !== "live") return mode === "demo" ? { ok: true, data: { id: "demo-item" } } : { ok: false, error: "Not configured." };

  const supabase = createSupabaseServerClient();
  const { data: room } = await supabase
    .from("rooms")
    .select("id, code")
    .eq("project_id", projectId)
    .order("position")
    .limit(1)
    .maybeSingle();
  if (!room) return { ok: false, error: "Add a room to that project first." };

  const { data: product } = await supabase
    .from("products")
    .select("price_amount")
    .eq("id", productId)
    .maybeSingle();

  const { count } = await supabase
    .from("schedule_items")
    .select("*", { count: "exact", head: true })
    .eq("room_id", room.id);
  const ref = `${room.code}-${String((count ?? 0) + 1).padStart(2, "0")}`;

  const { data, error } = await supabase
    .from("schedule_items")
    .insert({
      project_id: projectId,
      room_id: room.id,
      product_id: productId,
      ref_code: ref,
      qty: 1,
      unit_price: product?.price_amount ?? null,
      position: count ?? 0,
    })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Failed." };

  revalidatePath(`/projects/${projectId}`);
  return { ok: true, data: { id: data.id } };
}

export async function setItemStatus(
  itemId: string,
  projectId: string,
  status: ItemStatus,
): Promise<ActionResult> {
  const mode = guarded();
  if (mode !== "live") return mode === "demo" ? { ok: true } : { ok: false, error: "Not configured." };
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("schedule_items").update({ status }).eq("id", itemId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/projects/${projectId}`);
  return { ok: true };
}

/**
 * Public client-approval action (no login). Routes through the SECURITY DEFINER
 * set_shared_item_status function, which verifies the item belongs to the
 * token's still-shared project before mutating.
 */
export async function setSharedItemStatus(
  token: string,
  itemId: string,
  status: ItemStatus,
  comment?: string,
): Promise<ActionResult> {
  const mode = guarded();
  if (mode !== "live") return mode === "demo" ? { ok: true } : { ok: false, error: "Not configured." };
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.rpc("set_shared_item_status", {
    p_token: token,
    p_item: itemId,
    p_status: status,
    p_comment: comment ?? null,
  });
  if (error || data !== true) return { ok: false, error: error?.message ?? "Could not update." };
  return { ok: true };
}
