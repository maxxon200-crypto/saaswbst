import Link from "next/link";
import { APP_SIGN_IN } from "@/lib/links";
import { LocaleToggle } from "./LocaleToggle";
import type { Content } from "@/content/types";

/**
 * Footer — four columns over a hairline top border. No social icons: Metrica
 * has no public profiles yet. Add them (and only then) once real accounts exist.
 */
export function Footer({
  content,
  homeHref,
  privacyHref,
  termsHref,
}: {
  content: Content;
  homeHref: string;
  privacyHref: string;
  termsHref: string;
}) {
  const f = content.footer;
  return (
    <footer className="border-t border-hairline bg-bg">
      <div className="shell py-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link href={homeHref} className="text-[16px] font-medium text-text">
              {f.wordmark}
            </Link>
            <p className="mt-3 max-w-[24ch] text-[15px] text-text-dim">{f.tagline}</p>
          </div>

          <div>
            <p className="t-label mb-4">{f.productTitle}</p>
            <ul className="flex flex-col gap-2.5 text-[15px] text-text-dim">
              {content.nav.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="link-quiet">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={APP_SIGN_IN} className="link-quiet">
                  {content.nav.signIn}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="t-label mb-4">{f.companyTitle}</p>
            <ul className="flex flex-col gap-2.5 text-[15px] text-text-dim">
              <li>
                <a href={`mailto:${f.email}`} className="link-quiet">
                  {f.contact}
                </a>
              </li>
              <li>
                <Link href={privacyHref} className="link-quiet">
                  {f.privacy}
                </Link>
              </li>
              <li>
                <Link href={termsHref} className="link-quiet">
                  {f.terms}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="t-label mb-4">{f.languageTitle}</p>
            <LocaleToggle ariaLabel={content.nav.localeSwitch} />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[13px] text-text-mute">{f.rights}</span>
          <a href={`mailto:${f.email}`} className="link-quiet text-[15px] text-text">
            {f.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
