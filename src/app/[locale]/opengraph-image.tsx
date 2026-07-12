import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { getContent } from "@/content";

export const runtime = "nodejs";
export const alt = "Metrica — specification, without the copy-paste.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A static poster: --void ground, the wordmark, the tagline with one red word.
// Rendered with JetBrains Mono (satori needs woff, not woff2).
export default async function OpengraphImage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const c = getContent(locale);

  const [mono700, mono800] = await Promise.all([
    readFile(join(process.cwd(), "src/app/_og/JetBrainsMono-700.woff")),
    readFile(join(process.cwd(), "src/app/_og/JetBrainsMono-800.woff")),
  ]);

  const VOID = "#0C0C0C";
  const CHALK = "#F2F0ED";
  const SMOKE = "#8A8A8A";
  const BLOOD = "#C1121F";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: VOID,
          padding: "72px 80px",
          fontFamily: "mono",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", color: SMOKE, fontSize: 24, letterSpacing: 4 }}>
          <span>{c.hero.eyebrow.toUpperCase()}</span>
          <span>EST. 2026</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", color: CHALK, fontSize: 130, fontWeight: 800, letterSpacing: 8 }}>
            METRICA
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              marginTop: 24,
              color: CHALK,
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            <span>{`${c.hero.line1} ${c.hero.line2}`.toUpperCase()}</span>
            <span style={{ color: BLOOD, marginLeft: 14 }}>{c.hero.accent.toUpperCase()}</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", color: SMOKE, fontSize: 24, letterSpacing: 4 }}>
          <span>MILANO</span>
          <span>METRICA.STUDIO</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "mono", data: mono700, weight: 700, style: "normal" },
        { name: "mono", data: mono800, weight: 800, style: "normal" },
      ],
    },
  );
}
