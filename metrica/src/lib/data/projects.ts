import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isDemoMode, isSupabaseConfigured } from "@/lib/supabase/config";
import {
  demoBundle,
  demoProjectList,
  type ProjectBundle,
  type ProjectListRow,
  type ScheduleItemWithProduct,
} from "./demo";

export type { ProjectBundle, ProjectListRow, ScheduleItemWithProduct };

export async function listProjects(): Promise<ProjectListRow[]> {
  if (!isSupabaseConfigured()) return isDemoMode() ? demoProjectList() : [];

  const supabase = createSupabaseServerClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "active")
    .order("updated_at", { ascending: false });
  if (!projects?.length) return [];

  const ids = projects.map((p) => p.id);
  const { data: items } = await supabase
    .from("schedule_items")
    .select("project_id, qty, unit_price")
    .in("project_id", ids);

  const agg = new Map<string, { count: number; value: number }>();
  for (const it of items ?? []) {
    const a = agg.get(it.project_id) ?? { count: 0, value: 0 };
    a.count += 1;
    a.value += (it.unit_price ?? 0) * (it.qty ?? 1);
    agg.set(it.project_id, a);
  }

  return projects.map((p) => ({
    id: p.id,
    name: p.name,
    client_name: p.client_name,
    itemCount: agg.get(p.id)?.count ?? 0,
    value: agg.get(p.id)?.value ?? 0,
    currency: p.currency,
    status: p.status,
    updated_at: p.updated_at,
  }));
}

export async function getProjectBundle(id: string): Promise<ProjectBundle | null> {
  if (!isSupabaseConfigured()) return isDemoMode() ? demoBundle(id) : null;

  const supabase = createSupabaseServerClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!project) return null;

  const [{ data: rooms }, { data: items }] = await Promise.all([
    supabase.from("rooms").select("*").eq("project_id", id).order("position"),
    supabase
      .from("schedule_items")
      .select("*, product:products(*)")
      .eq("project_id", id)
      .order("position"),
  ]);

  return {
    project,
    rooms: rooms ?? [],
    items: (items ?? []) as ScheduleItemWithProduct[],
  };
}
