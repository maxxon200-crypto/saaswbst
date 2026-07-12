"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { addItemFromExtraction } from "@/lib/data/actions";
import type { ExtractionResult } from "@/lib/extract/schema";
import type { ProductSource } from "@/lib/db.types";
import type { ScheduleItemWithProduct } from "@/lib/data/demo";

type Tab = "url" | "file" | "manual";
type Step = "input" | "reading" | "review";

interface Draft {
  name: string; brand: string; designer: string; category: string;
  width_mm: string; depth_mm: string; height_mm: string; dimensions_raw: string;
  finish: string; materials: string;
  price_amount: string; price_currency: string; price_type: "trade" | "retail";
  lead_time_weeks: string;
  confidence: ExtractionResult["confidence"];
  uncertain: Set<string>;
  source: ProductSource;
}

const EMPTY: Draft = {
  name: "", brand: "", designer: "", category: "",
  width_mm: "", depth_mm: "", height_mm: "", dimensions_raw: "",
  finish: "", materials: "",
  price_amount: "", price_currency: "EUR", price_type: "trade", lead_time_weeks: "",
  confidence: "high", uncertain: new Set(), source: "manual",
};

function fromResult(r: ExtractionResult, source: ProductSource): Draft {
  const p = r.product;
  const s = (n: number | null) => (n == null ? "" : String(n));
  return {
    name: p.name, brand: p.brand, designer: p.designer, category: p.category,
    width_mm: s(p.dimensions.width_mm), depth_mm: s(p.dimensions.depth_mm),
    height_mm: s(p.dimensions.height_mm), dimensions_raw: p.dimensions.raw,
    finish: p.finish, materials: p.materials.join(", "),
    price_amount: s(p.price.amount), price_currency: p.price.currency || "EUR",
    price_type: p.price.type, lead_time_weeks: s(p.lead_time_weeks),
    confidence: r.confidence, uncertain: new Set(r.uncertain_fields), source,
  };
}

function toResult(d: Draft): ExtractionResult {
  const n = (v: string) => {
    const x = parseFloat(v.replace(/[^0-9.\-]/g, ""));
    return Number.isFinite(x) ? x : null;
  };
  return {
    confidence: d.confidence,
    uncertain_fields: [...d.uncertain],
    product: {
      name: d.name, brand: d.brand, collection: "", designer: d.designer,
      category: d.category, sku: "",
      dimensions: {
        width_mm: n(d.width_mm), depth_mm: n(d.depth_mm), height_mm: n(d.height_mm),
        seat_height_mm: null, diameter_mm: null, raw: d.dimensions_raw,
      },
      materials: d.materials.split(",").map((m) => m.trim()).filter(Boolean),
      finish: d.finish, colour: "",
      price: { amount: n(d.price_amount), currency: d.price_currency, type: d.price_type },
      lead_time_weeks: n(d.lead_time_weeks),
      description_en: "", description_it: "", source_url: "", image_url: "",
    },
  };
}

export function AddProductPanel({
  projectId,
  room,
  currency,
  onClose,
  onAdded,
}: {
  projectId: string;
  room: { id: string; code: string };
  currency: string;
  onClose: () => void;
  onAdded: (item: ScheduleItemWithProduct) => void;
}) {
  const [tab, setTab] = useState<Tab>("url");
  const [step, setStep] = useState<Step>("input");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [draft, setDraft] = useState<Draft>({ ...EMPTY, price_currency: currency });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function extract() {
    setStep("reading");
    setError(null);
    try {
      let body: Record<string, unknown>;
      let source: ProductSource;
      if (tab === "url") {
        body = { mode: "url", url, project_id: projectId };
        source = "url";
      } else {
        if (!file) throw new Error("Choose a file.");
        const supabase = createSupabaseBrowserClient();
        const path = `${projectId}/${crypto.randomUUID()}-${file.name}`;
        const up = await supabase.storage.from("source-files").upload(path, file);
        if (up.error) throw new Error(up.error.message);
        body = { mode: "file", file_path: path, project_id: projectId };
        source = "pdf";
      }
      const r = await fetch("/api/extract", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await r.json();
      if (!r.ok) throw new Error(json.message ?? "Extraction failed.");
      setDraft(fromResult(json.result as ExtractionResult, source));
      setStep("review");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Extraction failed.");
      setStep("input");
    }
  }

  async function add(saveToLibrary: boolean) {
    setSaving(true);
    setError(null);
    const result = toResult(draft);
    const res = await addItemFromExtraction({
      projectId, roomId: room.id, roomCode: room.code, result,
      source: draft.source, saveToLibrary,
    });
    if (!res.ok) {
      setError(res.error);
      setSaving(false);
      return;
    }
    // Optimistic row for immediate feedback.
    onAdded(buildOptimistic(draft, projectId, room, res.data.id));
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-[var(--scrim)]" aria-hidden onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add product"
        className="motion-panel relative h-full w-full max-w-[560px] overflow-y-auto border-l border-line bg-surface p-7"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-heading font-medium text-ink">Add product</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-stone hover:text-ink">
            ×
          </button>
        </div>

        {step !== "review" && (
          <>
            <div className="mt-6 flex gap-1 border-b border-line">
              {(["url", "file", "manual"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTab(t);
                    setError(null);
                    if (t === "manual") {
                      setDraft({ ...EMPTY, price_currency: currency });
                      setStep("review");
                    }
                  }}
                  className={cn(
                    "-mb-px border-b-2 px-3 py-2 text-[15px] transition-colors",
                    tab === t ? "border-accent font-medium text-accent" : "border-transparent text-stone hover:text-ink",
                  )}
                >
                  {t === "url" ? "Paste URL" : t === "file" ? "Drop PDF / image" : "Manual"}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {tab === "url" ? (
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://supplier.com/product"
                  className="w-full rounded-none border border-line bg-paper px-3 py-2.5 text-body text-ink outline-none focus:border-ink"
                />
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-line bg-paper px-6 py-12 text-center">
                  <span className="text-body text-ink">
                    {file ? file.name : "Drop a cut-sheet, or click to choose"}
                  </span>
                  <span className="label">PDF · JPG · PNG</span>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              )}
              {error && <p className="mt-3 text-[14px] text-negative">{error}</p>}
              <div className="mt-5">
                <Button onClick={extract} disabled={step === "reading" || (tab === "url" ? !url : !file)}>
                  {step === "reading" ? "Reading…" : "Extract"}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "review" && (
          <ReviewForm
            draft={draft}
            set={set}
            saving={saving}
            error={error}
            onBack={() => setStep("input")}
            onAdd={add}
          />
        )}
      </div>
    </div>
  );
}

function ReviewForm({
  draft,
  set,
  saving,
  error,
  onBack,
  onAdd,
}: {
  draft: Draft;
  set: <K extends keyof Draft>(k: K, v: Draft[K]) => void;
  saving: boolean;
  error: string | null;
  onBack: () => void;
  onAdd: (saveToLibrary: boolean) => void;
}) {
  const conf = draft.confidence;
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <span className="label">Review before adding</span>
        <span className={cn("label", conf === "high" ? "text-positive" : conf === "low" ? "text-negative" : "text-stone")}>
          {conf} confidence
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <ReviewField k="name" label="Name" draft={draft} set={set} className="col-span-2" />
        <ReviewField k="brand" label="Brand" draft={draft} set={set} />
        <ReviewField k="designer" label="Designer" draft={draft} set={set} />
        <ReviewField k="category" label="Category" draft={draft} set={set} />
        <ReviewField k="finish" label="Finish" draft={draft} set={set} />
        <ReviewField k="width_mm" label="Width (mm)" draft={draft} set={set} numeric />
        <ReviewField k="depth_mm" label="Depth (mm)" draft={draft} set={set} numeric />
        <ReviewField k="height_mm" label="Height (mm)" draft={draft} set={set} numeric />
        <ReviewField k="lead_time_weeks" label="Lead (weeks)" draft={draft} set={set} numeric />
        <ReviewField k="materials" label="Materials" draft={draft} set={set} className="col-span-2" />
        <ReviewField k="price_amount" label="Price" draft={draft} set={set} numeric />
        <ReviewField k="price_currency" label="Currency" draft={draft} set={set} />
      </div>

      {draft.dimensions_raw && (
        <p className="mt-4 border-l border-line pl-3 text-[14px] text-stone">
          Source read: “{draft.dimensions_raw}”
        </p>
      )}

      {error && <p className="mt-4 text-[14px] text-negative">{error}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button onClick={() => onAdd(false)} disabled={saving || !draft.name}>
          {saving ? "Adding…" : "Add to schedule"}
        </Button>
        <Button variant="secondary" onClick={() => onAdd(true)} disabled={saving || !draft.name}>
          Add and save to library
        </Button>
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}

function ReviewField({
  k,
  label,
  draft,
  set,
  numeric,
  className,
}: {
  k: keyof Draft;
  label: string;
  draft: Draft;
  set: <K extends keyof Draft>(key: K, v: Draft[K]) => void;
  numeric?: boolean;
  className?: string;
}) {
  const value = draft[k];
  const uncertain = draft.uncertain.has(k) || (k === "price_amount" && draft.uncertain.has("price"));
  return (
    <label className={cn("block", className)}>
      <span className="label flex items-center gap-2">
        {label}
        {uncertain && (
          <span className="flex items-center gap-1 normal-case tracking-normal text-stone">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-stone" />
            check this
          </span>
        )}
      </span>
      <input
        value={typeof value === "string" ? value : ""}
        onChange={(e) => set(k, e.target.value as never)}
        inputMode={numeric ? "decimal" : "text"}
        className={cn(
          "mt-2 w-full rounded-none border bg-paper px-3 py-2 text-body text-ink outline-none focus:border-ink",
          uncertain ? "border-stone" : "border-line",
          numeric && "[font-variant-numeric:tabular-nums]",
        )}
      />
    </label>
  );
}

function buildOptimistic(
  d: Draft,
  projectId: string,
  room: { id: string; code: string },
  id: string,
): ScheduleItemWithProduct {
  const num = (v: string) => {
    const x = parseFloat(v.replace(/[^0-9.\-]/g, ""));
    return Number.isFinite(x) ? x : null;
  };
  return {
    id, project_id: projectId, room_id: room.id, product_id: id,
    ref_code: `${room.code}-new`, qty: 1, unit_price: num(d.price_amount),
    markup_override: null, notes: null, position: 999, status: "pending",
    client_comment: null, created_at: new Date().toISOString(),
    product: {
      id, studio_id: null, name: d.name, brand: d.brand || null, collection: null,
      designer: d.designer || null, category: d.category || null, sku: null,
      width_mm: num(d.width_mm), depth_mm: num(d.depth_mm), height_mm: num(d.height_mm),
      seat_height_mm: null, diameter_mm: null, dimensions_raw: d.dimensions_raw || null,
      materials: d.materials.split(",").map((m) => m.trim()).filter(Boolean),
      finish: d.finish || null, colour: null, price_amount: num(d.price_amount),
      price_currency: d.price_currency, price_type: d.price_type,
      lead_time_weeks: num(d.lead_time_weeks), description_en: null, description_it: null,
      source_url: null, source_type: d.source, image_path: null,
      created_at: new Date().toISOString(),
    },
  };
}
