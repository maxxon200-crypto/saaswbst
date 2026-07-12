import { cn } from "@/lib/cn";
import type { ItemStatus } from "@/lib/db.types";

const COLOR: Record<ItemStatus, string> = {
  approved: "bg-positive",
  rejected: "bg-negative",
  pending: "bg-stone",
};

const LABEL: Record<ItemStatus, string> = {
  approved: "Approved",
  rejected: "Rejected",
  pending: "Pending",
};

export function StatusDot({ status, withLabel = false }: { status: ItemStatus; withLabel?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("inline-block h-2 w-2 rounded-full", COLOR[status])} aria-hidden />
      {withLabel && <span className="text-[14px] text-stone">{LABEL[status]}</span>}
      {!withLabel && <span className="sr-only">{LABEL[status]}</span>}
    </span>
  );
}
