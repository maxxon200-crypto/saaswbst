import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/i18n";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The application lives behind these paths and must never be indexed.
      disallow: ["/projects", "/library", "/settings", "/login", "/api", "/share"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
