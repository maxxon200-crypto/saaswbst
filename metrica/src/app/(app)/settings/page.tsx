import { getStudioContext } from "@/lib/studio";
import { PLAN_LABEL } from "@/lib/db.types";

// Milestone 1 shell placeholder. Full studio / billing / team settings land in
// Milestone 8 (billing) and are wired progressively.
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const ctx = await getStudioContext();

  return (
    <div>
      <header>
        <h1 className="text-page font-semibold text-ink">Settings</h1>
      </header>

      <dl className="mt-12 max-w-[560px] divide-y divide-line border-y border-line">
        <Row label="Studio" value={ctx.studioName} />
        <Row label="Plan" value={`${PLAN_LABEL[ctx.plan]}`} />
        <Row label="Signed in as" value={ctx.userEmail ?? "—"} />
      </dl>

      <p className="mt-10 text-body text-stone">
        Studio profile, branding, billing and team settings are wired in later
        milestones.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <dt className="label">{label}</dt>
      <dd className="text-body text-ink" data-numeric>
        {value}
      </dd>
    </div>
  );
}
