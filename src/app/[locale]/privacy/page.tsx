import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { defaultLocale, isLocale, localePath } from "@/lib/i18n";
import { getContent } from "@/content";
import { LegalPage } from "@/components/LegalPage";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const c = getContent(locale);
  const path = locale === defaultLocale ? "/privacy" : "/it/privacy";
  return {
    title: `${c.privacy.title} — Metrica`,
    alternates: {
      canonical: path,
      languages: { en: "/privacy", it: "/it/privacy", "x-default": "/privacy" },
    },
  };
}

export default function Privacy({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const c = getContent(locale);
  return (
    <LegalPage
      doc={c.privacy}
      content={c}
      homeHref={localePath(locale, "/")}
      privacyHref={localePath(locale, "/privacy")}
      termsHref={localePath(locale, "/terms")}
    />
  );
}
