/** Whether a live Supabase project is configured via env. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Local-only preview: render the authenticated shell with demo data when
 * Supabase is not configured. Never active in production once Supabase is set —
 * auth is always enforced when a project exists.
 */
export function isDemoMode(): boolean {
  return !isSupabaseConfigured() && process.env.NEXT_PUBLIC_METRICA_DEMO === "1";
}

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
