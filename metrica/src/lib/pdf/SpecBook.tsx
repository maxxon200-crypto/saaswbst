import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { ProductPricing } from "./pricing";
import { computeUnit, formatPdfMoney } from "./pricing";
import type { SpecBookOptions } from "./types";
import type { ProjectBundle, ScheduleItemWithProduct } from "@/lib/data/demo";

const C = {
  paper: "#F4F4F1",
  surface: "#FBFBF9",
  ink: "#1C1C1A",
  stone: "#6E6E68",
  line: "#E2E2DD",
  accent: "#7A2E2E",
};

const s = StyleSheet.create({
  page: {
    backgroundColor: C.paper,
    color: C.ink,
    fontFamily: "Satoshi",
    fontSize: 9.5,
    lineHeight: 1.5,
    paddingHorizontal: 48,
    paddingTop: 54,
    paddingBottom: 66,
  },
  wordmark: { fontSize: 8, letterSpacing: 2, fontWeight: 700, color: C.ink },
  label: { fontSize: 7.5, letterSpacing: 1.2, color: C.stone, textTransform: "uppercase" },
  hair: { borderBottomWidth: 0.75, borderColor: C.line },
  accentRule: { height: 2, width: 48, backgroundColor: C.accent },

  // cover
  coverName: { fontSize: 38, fontWeight: 600, letterSpacing: -1, lineHeight: 1.05, marginBottom: 14 },

  // section header
  sectionCode: { fontSize: 7.5, letterSpacing: 1.4, color: C.stone, textTransform: "uppercase" },
  sectionTitle: { fontSize: 20, fontWeight: 600, letterSpacing: -0.4, marginTop: 4 },

  // entry
  entry: { flexDirection: "row", gap: 20, marginBottom: 22 },
  thumb: {
    width: 150, height: 150, borderWidth: 0.75, borderColor: C.line,
    backgroundColor: C.surface, alignItems: "center", justifyContent: "center",
  },
  thumbLetter: { fontSize: 30, fontWeight: 500, color: C.stone },
  entryBody: { flex: 1 },
  ref: { fontSize: 7.5, letterSpacing: 1.2, color: C.stone },
  name: { fontSize: 15, fontWeight: 600, letterSpacing: -0.2, marginTop: 2 },
  meta: { fontSize: 7.5, letterSpacing: 1, color: C.stone, textTransform: "uppercase", marginTop: 4 },
  desc: { fontSize: 9, color: C.ink, marginTop: 8, lineHeight: 1.45 },
  specRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3.5, borderBottomWidth: 0.75, borderColor: C.line },
  specKey: { fontSize: 8, letterSpacing: 0.8, color: C.stone, textTransform: "uppercase" },
  specVal: { fontSize: 9.5, color: C.ink },

  // summary table
  sumHead: { flexDirection: "row", borderBottomWidth: 0.75, borderColor: C.line, paddingBottom: 5 },
  sumRow: { flexDirection: "row", paddingVertical: 5, borderBottomWidth: 0.75, borderColor: C.line },
  sumFoot: { flexDirection: "row", paddingVertical: 7, borderTopWidth: 1.4, borderColor: C.line, marginTop: 2 },

  footer: {
    position: "absolute", bottom: 30, left: 48, right: 48,
    borderTopWidth: 0.75, borderColor: C.line, paddingTop: 7,
    flexDirection: "row", justifyContent: "space-between",
  },
  footText: { fontSize: 8, color: C.stone },
});

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

interface Section {
  title: string;
  code: string;
  items: ScheduleItemWithProduct[];
}

function buildSections(bundle: ProjectBundle, group: SpecBookOptions["group"]): Section[] {
  if (group === "category") {
    const map = new Map<string, ScheduleItemWithProduct[]>();
    for (const it of bundle.items) {
      const key = it.product?.category || "Other";
      (map.get(key) ?? map.set(key, []).get(key)!).push(it);
    }
    return [...map.entries()].map(([title, items]) => ({
      title,
      code: title.slice(0, 3).toUpperCase(),
      items,
    }));
  }
  return bundle.rooms
    .map((r) => ({ title: r.name, code: r.code, items: bundle.items.filter((i) => i.room_id === r.id) }))
    .filter((sec) => sec.items.length > 0);
}

function Footer({ studioName, projectName }: { studioName: string; projectName: string }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footText}>{studioName}</Text>
      <Text style={s.footText}>{projectName}</Text>
      <Text style={s.footText} render={({ pageNumber }) => String(pageNumber)} />
    </View>
  );
}

function descFor(item: ScheduleItemWithProduct, locale: SpecBookOptions["locale"]): string {
  const p = item.product;
  if (!p) return "";
  if (locale === "it") return p.description_it || p.description_en || "";
  if (locale === "bilingual") {
    return [p.description_en, p.description_it].filter(Boolean).join("\n");
  }
  return p.description_en || p.description_it || "";
}

function Entry({
  item,
  pricing,
  options,
}: {
  item: ScheduleItemWithProduct;
  pricing: ProductPricing;
  options: SpecBookOptions;
}) {
  const p = item.product;
  const dims = [p?.width_mm, p?.depth_mm, p?.height_mm].filter((n): n is number => n != null);
  const dimStr = dims.length ? `${dims.join(" × ")} mm` : p?.dimensions_raw || "—";
  const desc = descFor(item, options.locale);

  const rows: [string, string][] = [
    ["Dimensions", dimStr],
    ["Finish", p?.finish || "—"],
    ["Materials", p?.materials?.length ? p.materials.join(", ") : "—"],
    ["Lead time", p?.lead_time_weeks ? `${p.lead_time_weeks} weeks` : "—"],
    ["Quantity", String(item.qty)],
  ];
  if (options.prices !== "none") {
    const unit = computeUnit(item, pricing);
    rows.push(["Unit price", formatPdfMoney(unit, pricing.currency)]);
    rows.push(["Line total", formatPdfMoney(unit != null ? unit * item.qty : null, pricing.currency)]);
  }

  return (
    <View style={s.entry} wrap={false}>
      <View style={s.thumb}>
        <Text style={s.thumbLetter}>{p?.name?.[0]?.toUpperCase() ?? "–"}</Text>
      </View>
      <View style={s.entryBody}>
        <Text style={s.ref}>{item.ref_code}</Text>
        <Text style={s.name}>{p?.name ?? "—"}</Text>
        <Text style={s.meta}>
          {[p?.brand, p?.designer, p?.collection].filter(Boolean).join("  ·  ")}
        </Text>
        {desc ? <Text style={s.desc}>{desc}</Text> : null}
        <View style={{ marginTop: 10 }}>
          {rows.map(([k, v]) => (
            <View style={s.specRow} key={k}>
              <Text style={s.specKey}>{k}</Text>
              <Text style={s.specVal}>{v}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export function SpecBook({
  bundle,
  options,
  studioName,
}: {
  bundle: ProjectBundle;
  options: SpecBookOptions;
  studioName: string;
}) {
  const { project } = bundle;
  const pricing: ProductPricing = {
    mode: options.prices,
    markup: project.markup,
    currency: project.currency,
  };
  const sections = buildSections(bundle, options.group);
  const size: "A4" | "LETTER" = options.paper === "Letter" ? "LETTER" : "A4";

  // Deterministic page numbers for the contents (cover + contents + 2 entries/page).
  let cursor = (options.cover ? 1 : 0) + 1; // first section page
  const sectionStart = sections.map((sec) => {
    const start = cursor;
    cursor += Math.max(1, Math.ceil(sec.items.length / 2));
    return start;
  });

  const projectTotal = bundle.items.reduce(
    (sum, it) => sum + (computeUnit(it, pricing) ?? 0) * it.qty,
    0,
  );

  return (
    <Document title={`${project.name} — Spec book`} author={studioName}>
      {options.cover && (
        <Page size={size} style={s.page}>
          <Text style={s.wordmark}>{studioName.toUpperCase()}</Text>
          <View style={{ flexGrow: 1, justifyContent: "flex-end" }}>
            <View style={s.accentRule} />
            <Text style={[s.coverName, { marginTop: 18 }]}>{project.name}</Text>
            <Text style={s.label}>
              {[project.client_name, "Specification"].filter(Boolean).join("  ·  ")}
            </Text>
          </View>
        </Page>
      )}

      {/* Contents */}
      <Page size={size} style={s.page}>
        <Text style={s.label}>Contents</Text>
        <View style={{ marginTop: 16 }}>
          {sections.map((sec, i) => (
            <View
              key={sec.code + i}
              style={[s.specRow, { paddingVertical: 8 }]}
            >
              <Text style={{ fontSize: 12, fontWeight: 500 }}>{sec.title}</Text>
              <Text style={{ fontSize: 10, color: C.stone }}>
                {sec.items.length} items · p. {sectionStart[i]}
              </Text>
            </View>
          ))}
          <View style={[s.specRow, { paddingVertical: 8, borderColor: C.line }]}>
            <Text style={{ fontSize: 12, fontWeight: 500 }}>Schedule summary</Text>
            <Text style={{ fontSize: 10, color: C.stone }}>p. {cursor}</Text>
          </View>
        </View>
        <Footer studioName={studioName} projectName={project.name} />
      </Page>

      {/* Room / category sections, 2 entries per page */}
      {sections.map((sec) =>
        chunk(sec.items, 2).map((pair, pageIdx) => (
          <Page key={`${sec.code}-${pageIdx}`} size={size} style={s.page}>
            {pageIdx === 0 && (
              <View style={{ marginBottom: 18 }}>
                <Text style={s.sectionCode}>{sec.code}</Text>
                <Text style={s.sectionTitle}>{sec.title}</Text>
                <View style={[s.hair, { marginTop: 12 }]} />
              </View>
            )}
            {pair.map((it) => (
              <Entry key={it.id} item={it} pricing={pricing} options={options} />
            ))}
            <Footer studioName={studioName} projectName={project.name} />
          </Page>
        )),
      )}

      {/* Schedule summary appendix */}
      <Page size={size} style={s.page}>
        <Text style={s.sectionCode}>Appendix</Text>
        <Text style={s.sectionTitle}>Schedule summary</Text>
        <View style={[s.sumHead, { marginTop: 16 }]}>
          <Text style={[s.specKey, { width: "12%" }]}>Ref</Text>
          <Text style={[s.specKey, { width: "38%" }]}>Product</Text>
          <Text style={[s.specKey, { width: "22%" }]}>Brand</Text>
          <Text style={[s.specKey, { width: "8%", textAlign: "right" }]}>Qty</Text>
          {options.prices !== "none" && (
            <Text style={[s.specKey, { width: "20%", textAlign: "right" }]}>Total</Text>
          )}
        </View>
        {bundle.items.map((it) => {
          const unit = computeUnit(it, pricing);
          return (
            <View style={s.sumRow} key={it.id}>
              <Text style={{ width: "12%", fontSize: 8.5, color: C.stone }}>{it.ref_code}</Text>
              <Text style={{ width: "38%", fontSize: 9.5 }}>{it.product?.name ?? "—"}</Text>
              <Text style={{ width: "22%", fontSize: 9.5, color: C.stone }}>{it.product?.brand ?? "—"}</Text>
              <Text style={{ width: "8%", fontSize: 9.5, textAlign: "right" }}>{it.qty}</Text>
              {options.prices !== "none" && (
                <Text style={{ width: "20%", fontSize: 9.5, textAlign: "right" }}>
                  {formatPdfMoney(unit != null ? unit * it.qty : null, pricing.currency)}
                </Text>
              )}
            </View>
          );
        })}
        {options.prices !== "none" && (
          <View style={s.sumFoot}>
            <Text style={[s.specKey, { flex: 1 }]}>Project total</Text>
            <Text style={{ fontSize: 12, fontWeight: 600 }}>
              {formatPdfMoney(projectTotal, pricing.currency)}
            </Text>
          </View>
        )}
        <Footer studioName={studioName} projectName={project.name} />
      </Page>
    </Document>
  );
}
