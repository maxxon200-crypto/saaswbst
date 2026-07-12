import Link from "next/link";
import { LocaleToggle } from "./LocaleToggle";
import type { FooterContent } from "@/content/types";

/**
 * Footer — dark zone, 1px --ash top border.
 *
 * No social icons: Metrica has no public profiles yet. Add them here (and only
 * here) once real accounts exist — flagged per spec.
 */
export function Footer({
  content,
  homeHref,
  privacyHref,
  termsHref,
  localeSwitch,
}: {
  content: FooterContent;
  homeHref: string;
  privacyHref: string;
  termsHref: string;
  localeSwitch: string;
}) {
  return (
    <footer className="border-t border-ash bg-void text-chalk">
      <div className="shell py-16 md:py-24">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href={homeHref} className="t-wordmark">
              {content.wordmark}
            </Link>
            <p className="t-mono mt-4 text-smoke">{content.madeIn}</p>
          </div>

          <a
            href={`mailto:${content.email}`}
            data-cursor
            className="link-quiet text-[clamp(24px,4vw,40px)] font-medium tracking-tighter text-chalk"
          >
            {content.email}
          </a>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-ash pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-7">
            <Link href={privacyHref} className="link-quiet t-mono text-smoke">
              {content.privacy}
            </Link>
            <Link href={termsHref} className="link-quiet t-mono text-smoke">
              {content.terms}
            </Link>
            <span className="t-mono text-smoke">{content.rights}</span>
          </div>
          <LocaleToggle ariaLabel={localeSwitch} className="text-chalk" />
        </div>
      </div>
    </footer>
  );
}
