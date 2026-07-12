import { getStudioContext } from "@/lib/studio";
import { getStudioUsage } from "@/lib/data/usage";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { BillingPanel } from "@/components/settings/BillingPanel";
import { DangerZone } from "@/components/settings/DangerZone";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const ctx = await getStudioContext();
  const usage = await getStudioUsage(ctx);

  let hasSubscription = false;
  if (!ctx.isDemo && isSupabaseConfigured()) {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from("studios")
      .select("stripe_subscription_id")
      .eq("id", ctx.studioId)
      .maybeSingle();
    hasSubscription = Boolean(data?.stripe_subscription_id);
  }

  return (
    <div className="max-w-[760px]">
      <h1 className="text-page font-semibold text-ink">Settings</h1>

      <section className="mt-10">
        <p className="label">Studio</p>
        <dl className="mt-3 divide-y divide-line border-y border-line">
          <Row label="Name" value={ctx.studioName} />
          <Row label="Signed in as" value={ctx.userEmail ?? "—"} />
          <Row label="Role" value={ctx.role} />
        </dl>
      </section>

      <div className="mt-14">
        <BillingPanel
          plan={ctx.plan}
          used={usage.used}
          limit={usage.limit}
          hasSubscription={hasSubscription}
        />
      </div>

      <section className="mt-16 border-t border-line pt-8">
        <p className="label">Account</p>
        <p className="mt-3 max-w-prose text-body text-stone">
          Delete your studio and everything in it. Your data is removed from our
          EU-hosted database and storage.
        </p>
        <div className="mt-4">
          <DangerZone />
        </div>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-6 py-3">
      <dt className="label">{label}</dt>
      <dd className="text-body text-ink">{value}</dd>
    </div>
  );
}
