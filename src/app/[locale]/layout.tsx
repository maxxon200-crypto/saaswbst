import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { satoshi, mono } from "@/lib/fonts";
import { defaultLocale, isLocale, locales, SITE_URL } from "@/lib/i18n";
import { getContent } from "@/content";
import SmoothScroll from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const c = getContent(locale);
  const home = locale === defaultLocale ? "/" : "/it";

  return {
    metadataBase: new URL(SITE_URL),
    title: c.meta.title,
    description: c.meta.description,
    applicationName: "Metrica",
    alternates: {
      canonical: home,
      languages: { en: "/", it: "/it", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      siteName: "Metrica",
      locale: locale === "it" ? "it_IT" : "en_US",
      url: home,
      title: c.meta.title,
      description: c.meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: c.meta.title,
      description: c.meta.description,
    },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!isLocale(locale)) notFound();

  return (
    // data-zone scopes the marketing palette so it can never touch the app's
    // Gesso tokens (a separate deployment).
    <html lang={locale} data-zone="marketing" className={`${satoshi.variable} ${mono.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
