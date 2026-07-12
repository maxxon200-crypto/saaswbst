import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/i18n";

// Static build timestamp — keeps the sitemap reproducible across builds.
const LAST_MODIFIED = "2026-01-01";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/privacy", "/terms"];
  return paths.map((p) => ({
    url: `${SITE_URL}${p || "/"}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.5,
    alternates: {
      languages: {
        en: `${SITE_URL}${p || "/"}`,
        it: `${SITE_URL}/it${p}`,
      },
    },
  }));
}
