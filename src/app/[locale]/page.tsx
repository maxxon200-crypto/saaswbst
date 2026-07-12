import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { getContent } from "@/content";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";

export default function Page({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const c = getContent(locale);
  const homeHref = localePath(locale, "/");
  const privacyHref = localePath(locale, "/privacy");

  return (
    <>
      <Nav content={c.nav} homeHref={homeHref} />
      <main>
        <Hero content={c.hero} />
        {/* Milestone 3: Problem + How it works. Milestone 4: Pricing, Manifesto, Waitlist. */}
      </main>
      <Footer
        content={c.footer}
        homeHref={homeHref}
        privacyHref={privacyHref}
        localeSwitch={c.nav.localeSwitch}
      />
    </>
  );
}
