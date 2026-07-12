"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { PLAN_PRICING } from "@/lib/plans";
import { PLAN_LABEL, type PlanTier } from "@/lib/db.types";

export function BillingPanel({
  plan,
  used,
  limit,
  hasSubscription,
}: {
  plan: PlanTier;
  used: number;
  limit: number;
  hasSubscription: boolean;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  async function go(path: string, body?: object) {
    setBusy(path);
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json();
      if (json.url) window.location.href = json.url;
      else setBusy(null);
    } catch {
      setBusy(null);
    }
  }

  return (
    <section>
      <div className="flex items-end justify-between border-b border-line pb-4">
        <div>
          <p className="label">Current plan</p>
          <p className="mt-2 text-heading font-medium text-ink">{PLAN_LABEL[plan]}</p>
        </div>
        {hasSubscription && (
          <Button variant="secondary" onClick={() => go("/api/stripe/portal")} disabled={busy !== null}>
            Manage billing
          </Button>
        )}
      </div>

      <div className="mt-6">
        <div className="flex items-baseline justify-between">
          <p className="label">Extractions this period</p>
          <p className="text-[15px] text-ink" data-numeric>
            {used} / {limit}
          </p>
        </div>
        <div className="mt-2 h-1 w-full bg-line">
          <div className={cn("h-full", pct >= 80 ? "bg-negative" : "bg-ink")} style={{ width: `${pct}%` }} />
        </div>
      </div>

      <p className="label mt-10">Plans · annual billing saves two months</p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {PLAN_PRICING.map((p) => {
          const current = p.tier === plan;
          return (
            <div
              key={p.tier}
              className={cn("border p-5", current ? "border-ink" : "border-line")}
            >
              <div className="flex items-baseline justify-between">
                <p className="font-medium text-ink">{p.name}</p>
                <p className="text-[15px] text-ink" data-numeric>
                  {p.price}<span className="text-stone">/mo</span>
                </p>
              </div>
              <p className="mt-3 text-[14px] text-stone">{p.seats}</p>
              <p className="text-[14px] text-stone">{p.extractions}</p>
              <div className="mt-5">
                {current ? (
                  <p className="label">Current plan</p>
                ) : (
                  <Button
                    variant={p.tier === "studio" ? "primary" : "secondary"}
                    className="w-full"
                    onClick={() => go("/api/stripe/checkout", { plan: p.tier })}
                    disabled={busy !== null}
                  >
                    {busy === "/api/stripe/checkout" ? "…" : `Choose ${p.name}`}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
