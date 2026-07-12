import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { computeUnit, formatPdfMoney, type ProductPricing } from "./pricing";
import type { Project } from "@/lib/db.types";
import type { ScheduleItemWithProduct } from "@/lib/data/demo";

const C = {
  paper: "#F4F4F1", surface: "#FBFBF9", ink: "#1C1C1A",
  stone: "#6E6E68", line: "#E2E2DD", accent: "#7A2E2E",
};

const s = StyleSheet.create({
  page: {
    backgroundColor: C.paper, color: C.ink, fontFamily: "Satoshi", fontSize: 10,
    paddingHorizontal: 54, paddingTop: 54, paddingBottom: 60,
  },
  topRow: { flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 0.75, borderColor: C.line, paddingBottom: 8 },
  label: { fontSize: 8, letterSpacing: 1.2, color: C.stone, textTransform: "uppercase" },
  hero: { flexDirection: "row", gap: 26, marginTop: 34 },
  thumb: { width: 220, height: 260, borderWidth: 0.75, borderColor: C.line, backgroundColor: C.surface, alignItems: "center", justifyContent: "center" },
  thumbLetter: { fontSize: 48, fontWeight: 500, color: C.stone },
  ref: { fontSize: 8, letterSpacing: 1.4, color: C.stone },
  name: { fontSize: 26, fontWeight: 600, letterSpacing: -0.6, marginTop: 4, lineHeight: 1.08 },
  meta: { fontSize: 8, letterSpacing: 1, color: C.stone, textTransform: "uppercase", marginTop: 8 },
  desc: { fontSize: 10, marginTop: 16, lineHeight: 1.5, color: C.ink },
  specRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5, borderBottomWidth: 0.75, borderColor: C.line },
  specKey: { fontSize: 8, letterSpacing: 0.8, color: C.stone, textTransform: "uppercase" },
  specVal: { fontSize: 10 },
  accentRule: { height: 2, width: 40, backgroundColor: C.accent, marginTop: 20 },
  footer: { position: "absolute", bottom: 30, left: 54, right: 54, borderTopWidth: 0.75, borderColor: C.line, paddingTop: 7, flexDirection: "row", justifyContent: "space-between" },
  footText: { fontSize: 8, color: C.stone },
});

export function Tearsheet({
  item,
  project,
  studioName,
  showPrice = true,
}: {
  item: ScheduleItemWithProduct;
  project: Project;
  studioName: string;
  showPrice?: boolean;
}) {
  const p = item.product;
  const pricing: ProductPricing = { mode: "trade", markup: project.markup, currency: project.currency };
  const dims = [p?.width_mm, p?.depth_mm, p?.height_mm].filter((n): n is number => n != null);
  const dimStr = dims.length ? `${dims.join(" × ")} mm` : p?.dimensions_raw || "—";

  const rows: [string, string][] = [
    ["Dimensions", dimStr],
    ["Finish", p?.finish || "—"],
    ["Materials", p?.materials?.length ? p.materials.join(", ") : "—"],
    ["Lead time", p?.lead_time_weeks ? `${p.lead_time_weeks} weeks` : "—"],
    ["Quantity", String(item.qty)],
  ];
  if (showPrice) {
    rows.push(["Unit price", formatPdfMoney(computeUnit(item, pricing), pricing.currency)]);
  }

  return (
    <Document title={`${p?.name ?? "Product"} — Tearsheet`} author={studioName}>
      <Page size="A4" style={s.page}>
        <View style={s.topRow}>
          <Text style={s.label}>{studioName}</Text>
          <Text style={s.label}>{project.name}</Text>
        </View>

        <View style={s.hero}>
          <View style={s.thumb}>
            <Text style={s.thumbLetter}>{p?.name?.[0]?.toUpperCase() ?? "–"}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.ref}>{item.ref_code}</Text>
            <Text style={s.name}>{p?.name ?? "—"}</Text>
            <Text style={s.meta}>{[p?.brand, p?.designer, p?.collection].filter(Boolean).join("  ·  ")}</Text>
            <View style={s.accentRule} />
          </View>
        </View>

        <View style={{ marginTop: 28 }}>
          {rows.map(([k, v]) => (
            <View style={s.specRow} key={k}>
              <Text style={s.specKey}>{k}</Text>
              <Text style={s.specVal}>{v}</Text>
            </View>
          ))}
        </View>

        {p?.description_en ? <Text style={s.desc}>{p.description_en}</Text> : null}

        <View style={s.footer}>
          <Text style={s.footText}>{studioName}</Text>
          <Text style={s.footText}>{project.name}</Text>
          <Text style={s.footText}>Specified with Metrica</Text>
        </View>
      </Page>
    </Document>
  );
}
