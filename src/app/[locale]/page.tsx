import type { Locale } from "@/lib/i18n";
import { defaultLocale, isLocale, localePath, SITE_URL } from "@/lib/i18n";
import { getContent } from "@/content";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Demo } from "@/components/Demo";
import { Problem } from "@/components/Problem";
import { Capabilities } from "@/components/Capabilities";
import { Pricing } from "@/components/Pricing";
import { Manifesto } from "@/components/Manifesto";
import { Footer } from "@/components/Footer";

export default function Page({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const c = getContent(locale);
  const homeHref = localePath(locale, "/");
  const privacyHref = localePath(locale, "/privacy");
  const termsHref = localePath(locale, "/terms");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Metrica",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: c.meta.description,
    url: SITE_URL,
    offers: {
      "@type": "Offer",
      price: "39",
      priceCurrency: "EUR",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav content={c.nav} homeHref={homeHref} />
      <main>
        <Hero content={c.hero} />
        <Demo content={c.demo} />
        <Problem content={c.problem} />
        <Capabilities content={c.capabilities} />
        <Pricing content={c.pricing} />
        <Manifesto content={c.manifesto} />
      </main>
      <Footer
        content={c.footer}
        homeHref={homeHref}
        privacyHref={privacyHref}
        termsHref={termsHref}
        localeSwitch={c.nav.localeSwitch}
      />
    </>
  );
}
