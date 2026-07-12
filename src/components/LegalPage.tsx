import Link from "next/link";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import type { Content, LegalDoc } from "@/content/types";

/**
 * Shared shell for /privacy and /terms — quiet, readable, same nav + footer.
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
      <main className="min-h-screen bg-bg">
        <div className="shell">
          <div className="mx-auto max-w-[760px] pb-24 pt-32 md:pt-40">
            <p className="t-label">{doc.label}</p>
            <h1 className="t-h2 mt-4">{doc.title}</h1>
            <p className="mt-4 text-[14px] text-text-mute">{doc.updated}</p>

            <div className="mt-14 space-y-10">
              {doc.sections.map((s) => (
                <section key={s.heading}>
                  <h2 className="text-[20px] font-medium text-text">{s.heading}</h2>
                  <div className="mt-3 max-w-[64ch] space-y-3">
                    {s.body.map((p, i) => (
                      <p key={i} className="text-[16px] text-text-dim">
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <Link href={homeHref} className="link-quiet mt-14 inline-block text-[15px] text-text">
              ← {doc.backHome}
            </Link>
          </div>
        </div>
      </main>
      <Footer
        content={content}
        homeHref={homeHref}
        privacyHref={privacyHref}
        termsHref={termsHref}
      />
    </>
  );
}
