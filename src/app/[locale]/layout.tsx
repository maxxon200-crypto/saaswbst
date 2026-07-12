import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { satoshi } from "@/lib/fonts";
import { isLocale, locales } from "@/lib/i18n";
import SmoothScroll from "@/components/SmoothScroll";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Capitolo — FF&E specification for European studios",
  description:
    "The FF&E specification and procurement tool built in Milan for European studios.",
};

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
    <html lang={locale} className={satoshi.variable}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
