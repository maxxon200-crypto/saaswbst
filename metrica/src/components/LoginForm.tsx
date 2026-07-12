"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "sending" | "sent" | "error";

export function LoginForm({ configured }: { configured: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const notConfigured = () => {
    setError("Authentication is not configured in this environment.");
    setStatus("error");
  };

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!configured) return notConfigured();
    setStatus("sending");
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  async function continueWithGoogle() {
    if (!configured) return notConfigured();
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  if (status === "sent") {
    return (
      <p className="mt-6 text-body text-ink">
        Check your email for a sign-in link.
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <form onSubmit={sendMagicLink} className="space-y-3">
        <label className="block">
          <span className="label">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-none border border-line bg-paper px-3 py-2.5 text-body text-ink outline-none transition-colors focus:border-ink"
          />
        </label>
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : "Email me a sign-in link"}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-line" />
        <span className="label">or</span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={continueWithGoogle}
      >
        Continue with Google
      </Button>

      {error && <p className="text-[14px] text-negative">{error}</p>}
    </div>
  );
}
