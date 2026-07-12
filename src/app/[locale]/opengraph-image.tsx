import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { getContent } from "@/content";

export const runtime = "nodejs";
export const alt = "Metrica — Excel for FF&E schedules.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * OG poster: charcoal ground, the wordmark, the headline — nothing else. No
 * accent colour, no giant type.
 *
 * NOTE: satori (next/og) must rasterize with an embedded font — it cannot use
 * the system stack. Switzer-400.woff is used ONLY here, server-side, to bake
 * this image; it is never served to a browser as a webfont. The site itself
 * loads no webfont for text.
 */
export default async function OpengraphImage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const c = getContent(locale);
  const font = await readFile(join(process.cwd(), "src/app/_og/Switzer-400.woff"));

  const BG = "#0A0A0A";
  const TEXT = "#F5F5F5";
  const DIM = "#9A9A9A";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 28,
          background: BG,
          padding: "80px",
          fontFamily: "Switzer",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: DIM, letterSpacing: "0.01em" }}>
          Metrica
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            color: TEXT,
            letterSpacing: "-0.03em",
            maxWidth: 920,
            lineHeight: 1.05,
          }}
        >
          {c.hero.headline}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Switzer", data: font, weight: 400, style: "normal" }] },
  );
}
