import { notFound } from "next/navigation";
import { getProjectBundle } from "@/lib/data/projects";
import { ScheduleScreen } from "@/components/schedule/ScheduleScreen";

export const dynamic = "force-dynamic";

export default async function ProjectSchedulePage({
  params,
}: {
  params: { id: string };
}) {
  const bundle = await getProjectBundle(params.id);
  if (!bundle) notFound();
  return <ScheduleScreen bundle={bundle} />;
}
