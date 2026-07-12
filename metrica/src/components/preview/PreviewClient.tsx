"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { createShareLink } from "@/lib/data/actions";
import { DEFAULT_OPTIONS, type SpecBookOptions } from "@/lib/pdf/types";

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="label">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1 border border-line">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "flex-1 px-2.5 py-1.5 text-[13px] transition-colors",
              value === o.value ? "bg-ink text-paper" : "bg-surface text-stone hover:text-ink",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PreviewClient({ projectId }: { projectId: string }) {
  const [opts, setOpts] = useState<SpecBookOptions>(DEFAULT_OPTIONS);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);

  async function makeShareLink() {
    setSharing(true);
    const res = await createShareLink(projectId);
    setSharing(false);
    if (res.ok) setShareUrl(res.data.url);
  }

  const query = useMemo(() => {
    const p = new URLSearchParams({
      project: projectId,
      cover: opts.cover ? "1" : "0",
      prices: opts.prices,
      group: opts.group,
      locale: opts.locale,
      paper: opts.paper,
    });
    return p.toString();
  }, [projectId, opts]);

  function set<K extends keyof SpecBookOptions>(k: K, v: SpecBookOptions[K]) {
    setOpts((o) => ({ ...o, [k]: v }));
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
      <div className="min-h-[70vh] border border-line bg-surface">
        {/* Server-rendered React-PDF, shown inline. */}
        <iframe
          key={query}
          src={`/api/spec-book?${query}`}
          title="Spec book preview"
          className="h-full min-h-[70vh] w-full"
        />
      </div>

      <aside className="space-y-6">
        <Segmented
          label="Prices"
          value={opts.prices}
          onChange={(v) => set("prices", v)}
          options={[
            { value: "trade", label: "Trade" },
            { value: "client", label: "Client" },
            { value: "none", label: "None" },
          ]}
        />
        <Segmented
          label="Group by"
          value={opts.group}
          onChange={(v) => set("group", v)}
          options={[
            { value: "room", label: "Room" },
            { value: "category", label: "Category" },
          ]}
        />
        <Segmented
          label="Language"
          value={opts.locale}
          onChange={(v) => set("locale", v)}
          options={[
            { value: "en", label: "EN" },
            { value: "it", label: "IT" },
            { value: "bilingual", label: "Both" },
          ]}
        />
        <Segmented
          label="Paper"
          value={opts.paper}
          onChange={(v) => set("paper", v)}
          options={[
            { value: "A4", label: "A4" },
            { value: "Letter", label: "Letter" },
          ]}
        />
        <div>
          <p className="label">Cover</p>
          <div className="mt-2 flex gap-1 border border-line">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                type="button"
                onClick={() => set("cover", v)}
                className={cn(
                  "flex-1 px-2.5 py-1.5 text-[13px] transition-colors",
                  opts.cover === v ? "bg-ink text-paper" : "bg-surface text-stone hover:text-ink",
                )}
              >
                {v ? "On" : "Off"}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 border-t border-line pt-6">
          <a
            href={`/api/spec-book?${query}&download=1`}
            className="inline-flex w-full items-center justify-center rounded bg-accent px-5 py-2.5 text-[15px] font-medium text-paper transition-colors hover:opacity-90"
          >
            Export PDF
          </a>
          <Button
            variant="secondary"
            className="w-full"
            onClick={makeShareLink}
            disabled={sharing}
          >
            {sharing ? "Creating…" : "Create client link"}
          </Button>
          {shareUrl && (
            <input
              readOnly
              value={shareUrl}
              onFocus={(e) => e.currentTarget.select()}
              className="w-full rounded-none border border-line bg-paper px-3 py-2 text-[13px] text-ink outline-none"
            />
          )}
        </div>
      </aside>
    </div>
  );
}
