import Link from "next/link";
import { LocaleToggle } from "./LocaleToggle";
import type { FooterContent } from "@/content/types";

/**
 * Footer. No social icons — Capitolo has no public profiles yet; add them here
 * only once real accounts exist (flagged per spec).
 */
export function Footer({
  content,
  homeHref,
  privacyHref,
  localeSwitch,
}: {
  content: FooterContent;
  homeHref: string;
  privacyHref: string;
  localeSwitch: string;
}) {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="shell py-16 md:py-20">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href={homeHref}
              className="text-[15px] font-bold uppercase tracking-[0.22em] text-ink"
            >
              Capitolo
            </Link>
            <p className="label mt-3">{content.madeIn}</p>
          </div>

          <a
            href={`mailto:${content.email}`}
            className="link-quiet text-[clamp(20px,3vw,28px)] font-medium tracking-display text-ink"
          >
            {content.email}
          </a>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6">
            <Link href={privacyHref} className="link-quiet text-[15px] text-ink">
              {content.privacy}
            </Link>
            <span className="label">© 2026 {content.rights}</span>
          </div>
          <LocaleToggle ariaLabel={localeSwitch} />
        </div>
      </div>
    </footer>
  );
}
