"use client";

import { useMemo, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { StatusDot } from "@/components/ui/StatusDot";
import { cn } from "@/lib/cn";
import { formatDimensions, formatMoney } from "@/lib/format";
import { deleteItem, updateItem } from "@/lib/data/actions";
import type { ProjectBundle, ScheduleItemWithProduct } from "@/lib/data/demo";
import {
  ITEM_STATUS_LABEL,
  ITEM_STATUS_ORDER,
  lineMargin,
  type ItemStatus,
} from "@/lib/db.types";
import { AddProductPanel } from "./AddProductPanel";
import { EditableNumber } from "./EditableNumber";

const SYMBOL: Record<string, string> = { EUR: "€", GBP: "£", USD: "$", CHF: "CHF " };
const TH = "px-3 py-3 label align-bottom";

type ItemPatch = Parameters<typeof updateItem>[2];

export function ScheduleScreen({ bundle }: { bundle: ProjectBundle }) {
  const { project, rooms } = bundle;
  const [items, setItems] = useState<ScheduleItemWithProduct[]>(bundle.items);
  const [activeRoom, setActiveRoom] = useState(rooms[0]?.id ?? "");
  const [adding, setAdding] = useState(false);

  const sym = SYMBOL[project.currency] ?? `${project.currency} `;
  const roomItems = useMemo(
    () => items.filter((i) => i.room_id === activeRoom),
    [items, activeRoom],
  );
  const projectTotal = useMemo(
    () => items.reduce((s, i) => s + (i.unit_price ?? 0) * i.qty, 0),
    [items],
  );
  const roomTotal = roomItems.reduce((s, i) => s + (i.unit_price ?? 0) * i.qty, 0);

  function patchLocal(id: string, patch: Partial<ScheduleItemWithProduct>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  // Optimistic write for any editable field (qty, price, status, supplier…).
  async function commit(id: string, patch: ItemPatch) {
    patchLocal(id, patch as Partial<ScheduleItemWithProduct>);
    const res = await updateItem(id, project.id, patch);
    return res.ok;
  }

  async function removeItem(id: string) {
    const snapshot = items;
    setItems((prev) => prev.filter((i) => i.id !== id));
    const res = await deleteItem(id, project.id);
    if (!res.ok) setItems(snapshot);
  }

  const activeRoomObj = rooms.find((r) => r.id === activeRoom);

  return (
    <div>
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-page font-semibold text-ink">{project.name}</h1>
          <p className="label mt-2">{project.client_name || "No client"}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setAdding(true)}>Add product</Button>
          <ButtonLink href={`/projects/${project.id}/preview`} variant="secondary">
            Preview spec book
          </ButtonLink>
        </div>
      </header>

      <div className="mt-8 flex items-baseline gap-4 border-t border-line pt-4">
        <span className="label">Total value</span>
        <span className="text-heading font-medium text-ink" data-numeric>
          {formatMoney(projectTotal, project.currency)}
        </span>
        <span className="label ml-auto">{items.length} items</span>
      </div>

      <div className="mt-6 flex flex-wrap gap-1 border-b border-line">
        {rooms.map((r) => {
          const count = items.filter((i) => i.room_id === r.id).length;
          const active = r.id === activeRoom;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setActiveRoom(r.id)}
              className={cn(
                "-mb-px border-b-2 px-4 py-2.5 text-[15px] transition-colors",
                active
                  ? "border-accent font-medium text-accent"
                  : "border-transparent text-stone hover:text-ink",
              )}
            >
              {r.name}
              <span className="ml-2 text-[13px] text-stone" data-numeric>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {roomItems.length === 0 ? (
        <div className="border-t border-line py-20 text-center">
          <p className="text-body text-stone">Nothing specified for this room yet.</p>
          <div className="mt-5 flex justify-center">
            <Button onClick={() => setAdding(true)}>Add product</Button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-body">
            <thead>
              <tr className="border-b border-line">
                <th className={cn(TH, "w-[56px]")} aria-label="Image" />
                <th className={cn(TH, "text-left")}>Ref</th>
                <th className={cn(TH, "text-left")}>Product</th>
                <th className={cn(TH, "text-left")}>Brand</th>
                <th className={cn(TH, "text-left")}>Dimensions</th>
                <th className={cn(TH, "text-left")}>Finish</th>
                <th className={cn(TH, "text-left")}>Supplier</th>
                <th className={cn(TH, "text-right")}>Qty</th>
                <th className={cn(TH, "text-right")}>Unit</th>
                <th className={cn(TH, "text-right")}>Total</th>
                <th className={cn(TH, "text-right")}>Margin</th>
                <th className={cn(TH, "text-left")}>Status</th>
              </tr>
            </thead>
            <tbody>
              {roomItems.map((it) => (
                <Row
                  key={it.id}
                  item={it}
                  sym={sym}
                  currency={project.currency}
                  onQty={(n) => commit(it.id, { qty: n })}
                  onPrice={(n) => commit(it.id, { unit_price: n })}
                  onSupplier={(v) => commit(it.id, { supplier_name: v })}
                  onStatus={(s) => commit(it.id, { status: s })}
                  onDelete={() => removeItem(it.id)}
                />
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-line">
                <td className="px-3 py-4 label" colSpan={9}>
                  {activeRoomObj?.name} subtotal
                </td>
                <td className="px-3 py-4 text-right font-medium text-ink" data-numeric>
                  {formatMoney(roomTotal, project.currency)}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {adding && activeRoomObj && (
        <AddProductPanel
          projectId={project.id}
          room={{ id: activeRoomObj.id, code: activeRoomObj.code }}
          currency={project.currency}
          onClose={() => setAdding(false)}
          onAdded={(item) => setItems((prev) => [...prev, item])}
        />
      )}
    </div>
  );
}

function Row({
  item,
  sym,
  currency,
  onQty,
  onPrice,
  onSupplier,
  onStatus,
  onDelete,
}: {
  item: ScheduleItemWithProduct;
  sym: string;
  currency: string;
  onQty: (n: number) => Promise<boolean>;
  onPrice: (n: number) => Promise<boolean>;
  onSupplier: (v: string | null) => Promise<boolean>;
  onStatus: (s: ItemStatus) => Promise<boolean>;
  onDelete: () => void;
}) {
  const p = item.product;
  const total = (item.unit_price ?? 0) * item.qty;
  const margin = lineMargin(item);

  return (
    <tr className="group border-b border-line align-middle transition-colors hover:bg-surface">
      <td className="px-3 py-3">
        <div className="flex h-12 w-12 items-center justify-center border border-line bg-paper text-[15px] font-medium text-stone">
          {p?.name?.[0]?.toUpperCase() ?? "–"}
        </div>
      </td>
      <td className="px-3 py-3 text-stone" data-numeric>
        {item.ref_code}
      </td>
      <td className="px-3 py-3">
        <span className="font-medium text-ink">{p?.name ?? "—"}</span>
        {p?.designer && <span className="mt-0.5 block text-[14px] text-stone">{p.designer}</span>}
      </td>
      <td className="px-3 py-3 text-stone">{p?.brand ?? "—"}</td>
      <td className="px-3 py-3 text-stone" data-numeric>
        {p ? formatDimensions(p) : "—"}
      </td>
      <td className="px-3 py-3 text-stone">{p?.finish ?? "—"}</td>
      <td className="px-3 py-3">
        <InlineText value={item.supplier_name} placeholder="—" onCommit={onSupplier} />
      </td>
      <td className="px-3 py-3 text-right">
        <EditableNumber value={item.qty} onCommit={onQty} min={1} />
      </td>
      <td className="px-3 py-3 text-right">
        <EditableNumber value={item.unit_price} onCommit={onPrice} prefix={sym} />
      </td>
      <td className="px-3 py-3 text-right font-medium text-ink" data-numeric>
        {formatMoney(total, currency)}
      </td>
      <td className="px-3 py-3 text-right" data-numeric>
        {margin.amount == null ? (
          <span className="text-stone">—</span>
        ) : (
          <span className={cn(margin.amount < 0 ? "text-negative" : "text-ink")}>
            {formatMoney(margin.amount, currency)}
            {margin.pct != null && (
              <span className="ml-1 text-[13px] text-stone">{margin.pct.toFixed(0)}%</span>
            )}
          </span>
        )}
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <StatusDot status={item.status} />
          <select
            value={item.status}
            onChange={(e) => onStatus(e.target.value as ItemStatus)}
            aria-label="Item status"
            className="max-w-[140px] cursor-pointer border border-line bg-paper px-2 py-1 text-[14px] text-ink transition-colors hover:border-stone focus:border-ink focus:outline-none"
          >
            {ITEM_STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {ITEM_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Remove item"
            className="ml-1 text-stone opacity-0 transition-opacity hover:text-negative group-hover:opacity-100"
          >
            ×
          </button>
        </div>
      </td>
    </tr>
  );
}

/** Minimal inline text field — commits on blur / Enter, reverts on Escape. */
function InlineText({
  value,
  placeholder,
  onCommit,
}: {
  value: string | null;
  placeholder?: string;
  onCommit: (v: string | null) => Promise<boolean>;
}) {
  const [draft, setDraft] = useState(value ?? "");

  function commit() {
    const next = draft.trim() === "" ? null : draft.trim();
    if (next !== (value ?? null)) onCommit(next);
  }

  return (
    <input
      value={draft}
      placeholder={placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          setDraft(value ?? "");
          e.currentTarget.blur();
        }
      }}
      className="w-[120px] border-b border-transparent bg-transparent py-0.5 text-[15px] text-ink placeholder:text-stone hover:border-line focus:border-ink focus:outline-none"
    />
  );
}
