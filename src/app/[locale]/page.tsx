import type { Locale } from "@/lib/i18n";
import { defaultLocale, isLocale, localePath, SITE_URL } from "@/lib/i18n";
import { getContent } from "@/content";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ProductVideo } from "@/components/ProductVideo";
import { SocialProof } from "@/components/SocialProof";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { ClosingCta } from "@/components/ClosingCta";
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
    offers: { "@type": "Offer", price: "39", priceCurrency: "EUR" },
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
        <ProductVideo label={c.videoPlaceholder} />
        <SocialProof content={c.socialProof} />
        <Features content={c.features} videoLabel={c.videoPlaceholder} />
        <Pricing content={c.pricing} />
        <Faq content={c.faq} />
        <ClosingCta content={c.closing} />
      </main>
      <Footer
        content={c}
        homeHref={homeHref}
        privacyHref={privacyHref}
        termsHref={termsHref}
      />
    </>
  );
}
