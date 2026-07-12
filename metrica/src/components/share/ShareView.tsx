"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { formatDimensions, formatMoney } from "@/lib/format";
import { setSharedItemStatus } from "@/lib/data/actions";
import type { SharedData, SharedItem } from "@/lib/data/share";
import type { ItemStatus } from "@/lib/db.types";

export function ShareView({ data, token }: { data: SharedData; token: string }) {
  const [items, setItems] = useState<SharedItem[]>(data.items);

  const approved = items.filter((i) => i.status === "approved").length;
  const total = items.length;

  async function update(id: string, status: ItemStatus, comment?: string) {
    const snapshot = items;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status, client_comment: comment ?? i.client_comment } : i)),
    );
    const res = await setSharedItemStatus(token, id, status, comment);
    if (!res.ok) setItems(snapshot);
  }

  const rooms = useMemo(
    () =>
      data.rooms
        .map((r) => ({ room: r, list: items.filter((i) => i.room_id === r.id) }))
        .filter((g) => g.list.length > 0),
    [data.rooms, items],
  );

  return (
    <div className="min-h-screen bg-paper">
      {/* Summary bar */}
      <div className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur-0">
        <div className="mx-auto flex max-w-[900px] items-center justify-between gap-6 px-6 py-4">
          <span className="label">
            {approved} of {total} approved
          </span>
          <div className="h-1 w-40 bg-line">
            <div
              className="h-full bg-positive transition-all"
              style={{ width: `${total ? (approved / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[900px] px-6 pb-24 pt-14">
        <header className="border-b border-line pb-10">
          <p className="label">{data.studio.name}</p>
          <h1 className="mt-4 text-page font-semibold tracking-title text-ink">{data.project.name}</h1>
          {data.project.client_name && (
            <p className="mt-3 text-body text-stone">Prepared for {data.project.client_name}</p>
          )}
        </header>

        {rooms.map(({ room, list }) => (
          <section key={room.id} className="mt-14">
            <h2 className="text-heading font-medium text-ink">{room.name}</h2>
            <div className="mt-6 space-y-6">
              {list.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  currency={data.project.currency}
                  onApprove={() => update(item.id, "approved")}
                  onReject={(c) => update(item.id, "rejected", c)}
                  onComment={(c) => update(item.id, item.status, c)}
                />
              ))}
            </div>
          </section>
        ))}

        <footer className="mt-20 border-t border-line pt-6">
          <p className="text-[13px] text-stone">Specified with Metrica</p>
        </footer>
      </div>
    </div>
  );
}

function ItemCard({
  item,
  currency,
  onApprove,
  onReject,
  onComment,
}: {
  item: SharedItem;
  currency: string;
  onApprove: () => void;
  onReject: (comment?: string) => void;
  onComment: (comment: string) => void;
}) {
  const p = item.product;
  const [comment, setComment] = useState(item.client_comment ?? "");
  const dims = p ? formatDimensions(p) : "—";

  return (
    <div className="border border-line bg-surface p-6">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center border border-line bg-paper text-[28px] font-medium text-stone">
          {p?.name?.[0]?.toUpperCase() ?? "–"}
        </div>

        <div className="flex-1">
          <p className="label">{item.ref_code}</p>
          <h3 className="mt-1 text-[19px] font-medium text-ink">{p?.name ?? "—"}</h3>
          <p className="mt-1 text-[14px] text-stone">
            {[p?.brand, p?.designer].filter(Boolean).join(" · ")}
          </p>
          <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-2">
            <Field label="Dimensions" value={dims} />
            {p?.finish && <Field label="Finish" value={p.finish} />}
            <Field label="Quantity" value={String(item.qty)} />
            {item.unit_price != null && (
              <Field label="Price" value={formatMoney(item.unit_price, currency)} />
            )}
          </dl>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:w-40">
          <button
            type="button"
            onClick={onApprove}
            className={cn(
              "rounded border px-4 py-2 text-[14px] transition-colors",
              item.status === "approved"
                ? "border-positive bg-positive text-paper"
                : "border-line text-ink hover:border-positive hover:text-positive",
            )}
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => onReject(comment || undefined)}
            className={cn(
              "rounded border px-4 py-2 text-[14px] transition-colors",
              item.status === "rejected"
                ? "border-negative bg-negative text-paper"
                : "border-line text-ink hover:border-negative hover:text-negative",
            )}
          >
            Reject
          </button>
        </div>
      </div>

      <div className="mt-4 border-t border-line pt-4">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onBlur={() => comment !== (item.client_comment ?? "") && onComment(comment)}
          placeholder="Add a note for the studio"
          className="w-full rounded-none border border-line bg-paper px-3 py-2 text-[15px] text-ink outline-none focus:border-ink"
        />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label">{label}</dt>
      <dd className="mt-1 text-[15px] text-ink" data-numeric>
        {value}
      </dd>
    </div>
  );
}
