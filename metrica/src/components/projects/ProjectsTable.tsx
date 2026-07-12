"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { formatDate, formatMoney } from "@/lib/format";
import type { ProjectListRow } from "@/lib/data/demo";

const HEAD = "px-4 py-3 text-left align-bottom label";

export function ProjectsTable({ projects }: { projects: ProjectListRow[] }) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto border-y border-line">
      <table className="w-full border-collapse text-body">
        <thead>
          <tr className="border-b border-line">
            <th className={HEAD}>Project</th>
            <th className={HEAD}>Client</th>
            <th className={cn(HEAD, "text-right")}>Items</th>
            <th className={cn(HEAD, "text-right")}>Value</th>
            <th className={cn(HEAD, "text-right")}>Updated</th>
            <th className={cn(HEAD, "text-right")}>Status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr
              key={p.id}
              onClick={() => router.push(`/projects/${p.id}`)}
              className="cursor-pointer border-b border-line bg-surface transition-colors hover:bg-paper"
            >
              <td className="px-4 py-4 font-medium text-ink">{p.name}</td>
              <td className="px-4 py-4 text-stone">{p.client_name || "—"}</td>
              <td className="px-4 py-4 text-right text-ink" data-numeric>
                {p.itemCount}
              </td>
              <td className="px-4 py-4 text-right text-ink" data-numeric>
                {formatMoney(p.value, p.currency)}
              </td>
              <td className="px-4 py-4 text-right text-stone" data-numeric>
                {formatDate(p.updated_at)}
              </td>
              <td className="px-4 py-4 text-right">
                <span className="label">{p.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
