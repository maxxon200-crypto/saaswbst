"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";
import { formatDimensions, formatMoney } from "@/lib/format";
import { addLibraryProductToProject } from "@/lib/data/actions";
import type { Product } from "@/lib/db.types";

type View = "table" | "grid";
const TH = "px-3 py-3 label align-bottom text-left";

export function LibraryClient({
  products,
  projects,
}: {
  products: Product[];
  projects: { id: string; name: string }[];
}) {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [view, setView] = useState<View>("table");
  const [selected, setSelected] = useState<Product | null>(null);

  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort() as string[],
    [products],
  );
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))].sort() as string[],
    [products],
  );

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return products.filter((p) => {
      if (brand && p.brand !== brand) return false;
      if (category && p.category !== category) return false;
      if (s && ![p.name, p.brand, p.designer, p.sku].some((x) => x?.toLowerCase().includes(s)))
        return false;
      return true;
    });
  }, [products, search, brand, category]);

  return (
    <div>
      <div className="flex flex-wrap items-end gap-4">
        <label className="min-w-[220px] flex-1">
          <span className="label">Search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, brand, designer"
            className="mt-2 w-full rounded-none border border-line bg-paper px-3 py-2.5 text-body text-ink outline-none focus:border-ink"
          />
        </label>
        <Filter label="Brand" value={brand} onChange={setBrand} options={brands} />
        <Filter label="Category" value={category} onChange={setCategory} options={categories} />
        <div className="flex gap-1 border border-line">
          {(["table", "grid"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn(
                "px-3 py-2 text-[13px] capitalize transition-colors",
                view === v ? "bg-ink text-paper" : "bg-surface text-stone hover:text-ink",
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <p className="label mt-6">{filtered.length} products</p>

      {view === "table" ? (
        <div className="mt-3 overflow-x-auto border-y border-line">
          <table className="w-full border-collapse text-body">
            <thead>
              <tr className="border-b border-line">
                <th className={TH}>Brand</th>
                <th className={TH}>Product</th>
                <th className={TH}>Designer</th>
                <th className={TH}>Category</th>
                <th className={TH}>Dimensions</th>
                <th className={cn(TH, "text-right")}>Trade</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="cursor-pointer border-b border-line bg-surface transition-colors hover:bg-paper"
                >
                  <td className="px-3 py-3 text-stone">{p.brand}</td>
                  <td className="px-3 py-3 font-medium text-ink">{p.name}</td>
                  <td className="px-3 py-3 text-stone">{p.designer ?? "—"}</td>
                  <td className="px-3 py-3 text-stone">{p.category ?? "—"}</td>
                  <td className="px-3 py-3 text-stone" data-numeric>
                    {formatDimensions(p)}
                  </td>
                  <td className="px-3 py-3 text-right text-ink" data-numeric>
                    {formatMoney(p.price_amount, p.price_currency ?? "EUR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p)}
              className="border border-line bg-surface p-4 text-left transition-colors hover:bg-paper"
            >
              <div className="flex aspect-square items-center justify-center border border-line bg-paper text-[28px] font-medium text-stone">
                {p.name[0]?.toUpperCase()}
              </div>
              <p className="mt-3 font-medium text-ink">{p.name}</p>
              <p className="label mt-1">{p.brand}</p>
              <p className="mt-2 text-[15px] text-stone" data-numeric>
                {formatMoney(p.price_amount, p.price_currency ?? "EUR")}
              </p>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <ProductDetail product={selected} projects={projects} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 rounded-none border border-line bg-paper px-3 py-2.5 text-body text-ink outline-none focus:border-ink"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function ProductDetail({
  product,
  projects,
  onClose,
}: {
  product: Product;
  projects: { id: string; name: string }[];
  onClose: () => void;
}) {
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [status, setStatus] = useState<"idle" | "adding" | "done" | "error">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function add() {
    if (!projectId) return;
    setStatus("adding");
    const res = await addLibraryProductToProject(product.id, projectId);
    if (res.ok) {
      setStatus("done");
      setMsg("Added to project.");
    } else {
      setStatus("error");
      setMsg(res.error);
    }
  }

  const rows: [string, string][] = [
    ["Brand", product.brand ?? "—"],
    ["Designer", product.designer ?? "—"],
    ["Category", product.category ?? "—"],
    ["Dimensions", formatDimensions(product)],
    ["Finish", product.finish ?? "—"],
    ["Materials", product.materials.length ? product.materials.join(", ") : "—"],
    ["Lead time", product.lead_time_weeks ? `${product.lead_time_weeks} weeks` : "—"],
    ["Trade price", formatMoney(product.price_amount, product.price_currency ?? "EUR")],
  ];

  return (
    <Modal open onClose={onClose} title={product.name}>
      <dl className="divide-y divide-line border-y border-line">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-6 py-2.5">
            <dt className="label">{k}</dt>
            <dd className="text-right text-body text-ink" data-numeric>
              {v}
            </dd>
          </div>
        ))}
      </dl>

      {(product.description_en || product.description_it) && (
        <div className="mt-4 space-y-2">
          {product.description_en && <p className="text-[15px] text-ink">{product.description_en}</p>}
          {product.description_it && <p className="text-[15px] text-stone">{product.description_it}</p>}
        </div>
      )}

      <div className="mt-6 flex items-end gap-3 border-t border-line pt-5">
        <label className="flex-1">
          <span className="label">Add to project</span>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="mt-2 w-full rounded-none border border-line bg-paper px-3 py-2.5 text-body text-ink outline-none focus:border-ink"
          >
            {projects.length === 0 && <option value="">No projects</option>}
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <Button onClick={add} disabled={!projectId || status === "adding" || status === "done"}>
          {status === "done" ? "Added" : status === "adding" ? "Adding…" : "Add"}
        </Button>
      </div>
      {msg && (
        <p className={cn("mt-3 text-[14px]", status === "error" ? "text-negative" : "text-positive")}>{msg}</p>
      )}
    </Modal>
  );
}
