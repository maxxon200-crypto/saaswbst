export const locales = ["en", "it"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** URL prefix for a locale — the default locale lives at the root (no prefix). */
export function localePath(locale: Locale, path = ""): string {
  const clean = path.startsWith("/") ? path : path ? `/${path}` : "";
  if (locale === defaultLocale) return clean || "/";
  return `/${locale}${clean}`;
}

export const SITE_URL = "https://metrica.studio";
