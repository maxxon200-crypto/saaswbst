"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { ExtractionResult } from "@/lib/extract/schema";

type Mode = "url" | "file";
type Status = "idle" | "working" | "done" | "error";

interface ExtractResponse {
  result?: ExtractionResult;
  usage?: { used: number; limit: number; remaining: number };
  error?: string;
  message?: string;
}

/**
 * Bare extraction harness (Milestone 2). Proves the pipeline end-to-end against
 * a real URL or an uploaded PDF/image. The confidence + uncertain-field
 * treatment here becomes the review step in Milestone 3.
 */
export function ExtractTester({ studioId }: { studioId: string }) {
  const [projectId, setProjectId] = useState("");
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [res, setRes] = useState<ExtractResponse | null>(null);

  async function submit() {
    setStatus("working");
    setRes(null);
    try {
      let body: Record<string, unknown>;
      if (mode === "url") {
        body = { mode, url, project_id: projectId };
      } else {
        if (!file) throw new Error("Choose a file first.");
        const supabase = createSupabaseBrowserClient();
        const path = `${studioId}/${crypto.randomUUID()}-${file.name}`;
        const { error } = await supabase.storage
          .from("source-files")
          .upload(path, file, { upsert: false });
        if (error) throw new Error(`Upload failed: ${error.message}`);
        body = { mode, file_path: path, project_id: projectId };
      }

      const r = await fetch("/api/extract", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json: ExtractResponse = await r.json();
      setRes(json);
      setStatus(r.ok ? "done" : "error");
    } catch (e) {
      setRes({ error: "client_error", message: e instanceof Error ? e.message : "Failed" });
      setStatus("error");
    }
  }

  return (
    <div className="max-w-[720px]">
      <div className="border border-line bg-surface p-6">
        <label className="block">
          <span className="label">Project ID</span>
          <input
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="uuid of a project you own"
            className="mt-2 w-full rounded-none border border-line bg-paper px-3 py-2.5 text-body text-ink outline-none focus:border-ink"
          />
        </label>

        <div className="mt-5 flex gap-1 border-b border-line">
          {(["url", "file"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "-mb-px border-b-2 px-3 py-2 text-[15px] transition-colors",
                mode === m
                  ? "border-accent font-medium text-accent"
                  : "border-transparent text-stone hover:text-ink",
              )}
            >
              {m === "url" ? "Paste URL" : "Upload PDF / image"}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {mode === "url" ? (
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              className="w-full rounded-none border border-line bg-paper px-3 py-2.5 text-body text-ink outline-none focus:border-ink"
            />
          ) : (
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-body text-ink file:mr-4 file:rounded-none file:border file:border-ink file:bg-transparent file:px-4 file:py-2 file:text-[14px] file:text-ink"
            />
          )}
        </div>

        <div className="mt-5">
          <Button onClick={submit} disabled={status === "working" || !projectId}>
            {status === "working" ? "Reading…" : "Extract"}
          </Button>
        </div>
      </div>

      {res && <ResultView res={res} status={status} />}
    </div>
  );
}

function ResultView({ res, status }: { res: ExtractResponse; status: Status }) {
  if (status === "error" || res.error) {
    return (
      <div className="mt-5 border border-negative bg-surface p-5">
        <p className="label text-negative">{res.error ?? "error"}</p>
        <p className="mt-2 text-body text-ink">{res.message}</p>
      </div>
    );
  }
  if (!res.result) return null;
  const { confidence, uncertain_fields, product } = res.result;
  const uncertain = new Set(uncertain_fields);

  const rows: [string, string, string][] = [
    ["name", "Name", product.name],
    ["brand", "Brand", product.brand],
    ["designer", "Designer", product.designer],
    ["category", "Category", product.category],
    ["dimensions", "Dimensions (mm)", dims(product.dimensions)],
    ["finish", "Finish", product.finish],
    ["materials", "Materials", product.materials.join(", ")],
    ["price", "Price", price(product.price)],
    ["lead_time_weeks", "Lead time", product.lead_time_weeks ? `${product.lead_time_weeks} wks` : "—"],
  ];

  return (
    <div className="motion-result mt-5 border border-line bg-surface p-6">
      <div className="flex items-center justify-between">
        <span className="label">Extracted</span>
        <span
          className={cn(
            "label",
            confidence === "high" ? "text-positive" : confidence === "low" ? "text-negative" : "text-stone",
          )}
        >
          {confidence} confidence
        </span>
      </div>
      <dl className="mt-4 divide-y divide-line border-y border-line">
        {rows.map(([key, label, value]) => (
          <div key={key} className="flex items-baseline justify-between gap-6 py-2.5">
            <dt className="label flex items-center gap-2">
              {label}
              {uncertain.has(key) && (
                <span className="flex items-center gap-1 normal-case tracking-normal text-stone">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-stone" />
                  check this
                </span>
              )}
            </dt>
            <dd className="text-body text-ink" data-numeric>
              {value || "—"}
            </dd>
          </div>
        ))}
      </dl>
      {res.usage && (
        <p className="label mt-4">
          {res.usage.used} / {res.usage.limit} extractions used
        </p>
      )}
    </div>
  );
}

function dims(d: ExtractionResult["product"]["dimensions"]): string {
  const parts = [d.width_mm, d.depth_mm, d.height_mm].filter((n): n is number => n != null);
  if (parts.length) return `${parts.join(" × ")} mm`;
  return d.raw || "—";
}

function price(p: ExtractionResult["product"]["price"]): string {
  if (p.amount == null) return "—";
  return `${p.currency} ${p.amount.toLocaleString()} ${p.type}`;
}
