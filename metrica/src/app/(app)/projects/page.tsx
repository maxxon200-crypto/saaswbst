import { NewProjectDialog } from "@/components/projects/NewProjectDialog";
import { ProjectsTable } from "@/components/projects/ProjectsTable";
import { listProjects } from "@/lib/data/projects";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <div>
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-page font-semibold text-ink">Projects</h1>
        <NewProjectDialog />
      </header>

      {projects.length === 0 ? (
        <div className="mt-16 border-t border-line pt-20 text-center">
          <p className="text-body text-stone">No projects yet.</p>
          <div className="mt-5 flex justify-center">
            <NewProjectDialog />
          </div>
        </div>
      ) : (
        <div className="mt-10">
          <ProjectsTable projects={projects} />
        </div>
      )}
    </div>
  );
}
