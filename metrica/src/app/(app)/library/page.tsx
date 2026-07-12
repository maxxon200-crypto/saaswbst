import { LibraryClient } from "@/components/library/LibraryClient";
import { listLibrary } from "@/lib/data/library";
import { listProjects } from "@/lib/data/projects";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const [products, projects] = await Promise.all([listLibrary(), listProjects()]);

  return (
    <div>
      <header>
        <h1 className="text-page font-semibold text-ink">Library</h1>
        <p className="mt-3 max-w-[56ch] text-body text-stone">
          Every product your studio has extracted or added, alongside a curated
          European starter library with correct metric dimensions and IT/EN
          descriptions.
        </p>
      </header>
      <div className="mt-8">
        <LibraryClient
          products={products}
          projects={projects.map((p) => ({ id: p.id, name: p.name }))}
        />
      </div>
    </div>
  );
}
