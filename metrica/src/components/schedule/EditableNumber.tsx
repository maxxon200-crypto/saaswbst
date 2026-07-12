"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Click-to-edit numeric cell. Optimistic: the value updates immediately and the
 * save runs in the background; a failed save rolls back.
 */
export function EditableNumber({
  value,
  onCommit,
  prefix,
  align = "right",
  min = 0,
}: {
  value: number | null;
  onCommit: (next: number) => Promise<boolean>;
  prefix?: string;
  align?: "right" | "left";
  min?: number;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value ?? ""));

  async function commit() {
    setEditing(false);
    const next = Number(draft.replace(/[^0-9.\-]/g, ""));
    if (!Number.isFinite(next) || next === value) return;
    const ok = await onCommit(next);
    if (!ok) setDraft(String(value ?? "")); // roll back
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setDraft(String(value ?? ""));
            setEditing(false);
          }
        }}
        inputMode="decimal"
        className={cn(
          "w-24 rounded-none border border-ink bg-paper px-2 py-1 text-body text-ink outline-none [font-variant-numeric:tabular-nums]",
          align === "right" ? "text-right" : "text-left",
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(String(value ?? ""));
        setEditing(true);
      }}
      className={cn(
        "w-full rounded px-2 py-1 text-body text-ink [font-variant-numeric:tabular-nums] hover:bg-paper",
        align === "right" ? "text-right" : "text-left",
      )}
    >
      {prefix}
      {value == null ? "—" : value.toLocaleString("en-GB")}
    </button>
  );
}
