import { cn } from "@/lib/cn";
import { ITEM_STATUS_LABEL, type ItemStatus } from "@/lib/db.types";

// Colour-coded with the app's existing status tokens only — no new colours.
const COLOR: Record<ItemStatus, string> = {
  selected: "bg-stone",
  approved: "bg-positive",
  rejected: "bg-negative",
  ordered: "bg-ink",
  in_production: "bg-accent",
  shipped: "bg-accent",
  delivered: "bg-positive",
  installed: "bg-positive",
};

export function StatusDot({
  status,
  withLabel = false,
}: {
  status: ItemStatus;
  withLabel?: boolean;
}) {
  const label = ITEM_STATUS_LABEL[status];
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("inline-block h-2 w-2 rounded-full", COLOR[status])} aria-hidden />
      {withLabel && <span className="text-[14px] text-stone">{label}</span>}
      {!withLabel && <span className="sr-only">{label}</span>}
    </span>
  );
}
