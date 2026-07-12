import Link from "next/link";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import type { Content, LegalDoc } from "@/content/types";

/**
 * Shared shell for /privacy and /terms — --void, quiet, readable. Reuses the
 * marketing Nav (which starts solid here since there is no hero) and Footer.
 */
export function LegalPage({
  doc,
  content,
  homeHref,
  privacyHref,
  termsHref,
}: {
  doc: LegalDoc;
  content: Content;
  homeHref: string;
  privacyHref: string;
  termsHref: string;
}) {
  return (
    <>
      <Nav content={content.nav} homeHref={homeHref} />
      <main className="min-h-screen bg-void text-chalk">
        <div className="shell">
          <div className="mx-auto max-w-[820px] pb-28 pt-40 md:pt-48">
            <p className="t-mono text-smoke">{doc.label}</p>
            <h1 className="t-headline mt-6 uppercase">{doc.title}</h1>
            <p className="t-mono mt-6 text-smoke">{doc.updated}</p>

            <div className="mt-16 space-y-12">
              {doc.sections.map((s) => (
                <section key={s.heading}>
                  <h2 className="text-[clamp(21px,2.2vw,28px)] font-bold tracking-tight text-chalk">
                    {s.heading}
                  </h2>
                  <div className="mt-4 max-w-[62ch] space-y-4">
                    {s.body.map((p, i) => (
                      <p key={i} className="text-body text-smoke">
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <Link href={homeHref} className="link-quiet t-mono mt-16 inline-block text-chalk">
              ← {doc.backHome}
            </Link>
          </div>
        </div>
      </main>
      <Footer
        content={content.footer}
        homeHref={homeHref}
        privacyHref={privacyHref}
        termsHref={termsHref}
        localeSwitch={content.nav.localeSwitch}
      />
    </>
  );
}
