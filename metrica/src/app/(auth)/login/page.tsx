import { LoginForm } from "@/components/LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 text-center">
          <span className="text-[16px] font-bold uppercase tracking-[0.24em] text-ink">
            Metrica
          </span>
        </div>

        <div className="border border-line bg-surface p-8">
          <h1 className="text-heading font-medium text-ink">Sign in</h1>
          <p className="mt-2 text-[15px] text-stone">
            FF&E specification for European studios.
          </p>
          <LoginForm configured={isSupabaseConfigured()} />
        </div>

        <p className="label mt-6 text-center">GDPR · EU data residency</p>
      </div>
    </main>
  );
}
