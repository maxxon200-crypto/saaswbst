import { ButtonLink } from "@/components/ui/Button";

// Milestone 1 shell placeholder. The real project list + creation lands in
// Milestone 3.
export default function ProjectsPage() {
  return (
    <div>
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-page font-semibold text-ink">Projects</h1>
        <ButtonLink href="/projects" variant="primary">
          New project
        </ButtonLink>
      </header>

      <div className="mt-16 border-t border-line pt-20 text-center">
        <p className="text-body text-stone">No projects yet.</p>
        <div className="mt-5 flex justify-center">
          <ButtonLink href="/projects" variant="secondary">
            New project
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
