import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBundle } from "@/lib/data/projects";

// Milestone 4 builds the React-PDF spec book preview + export here.
export const dynamic = "force-dynamic";

export default async function PreviewPage({ params }: { params: { id: string } }) {
  const bundle = await getProjectBundle(params.id);
  if (!bundle) notFound();

  return (
    <div>
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-page font-semibold text-ink">{bundle.project.name}</h1>
          <p className="label mt-2">Spec book preview</p>
        </div>
        <Link href={`/projects/${params.id}`} className="link-quiet text-[15px] text-ink">
          Back to schedule
        </Link>
      </header>
      <div className="mt-16 border-t border-line pt-20 text-center">
        <p className="text-body text-stone">
          The typeset spec book preview and PDF export arrive in Milestone 4.
        </p>
      </div>
    </div>
  );
}
