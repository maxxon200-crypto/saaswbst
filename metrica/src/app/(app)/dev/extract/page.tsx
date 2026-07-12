import { ExtractTester } from "@/components/dev/ExtractTester";
import { getStudioContext } from "@/lib/studio";

// Milestone 2 harness. Kept behind the app shell (authenticated). Use it to
// prove extraction against a B&B Italia page, a Flos PDF cut-sheet, and a
// photographed catalogue page before wiring extraction into the schedule (M3).
export const dynamic = "force-dynamic";

export default async function DevExtractPage() {
  const ctx = await getStudioContext();

  return (
    <div>
      <header>
        <h1 className="text-page font-semibold text-ink">Extraction harness</h1>
        <p className="mt-3 max-w-[60ch] text-body text-stone">
          Paste a supplier URL or drop a manufacturer cut-sheet. Both feed the
          same pipeline. Low-confidence fields are flagged for review — never
          inserted silently.
        </p>
      </header>
      <div className="mt-10">
        <ExtractTester studioId={ctx.studioId} />
      </div>
    </div>
  );
}
