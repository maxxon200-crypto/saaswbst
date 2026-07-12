"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { APP_SIGN_IN, APP_START } from "@/lib/links";
import { LocaleToggle } from "./LocaleToggle";
import type { NavContent } from "@/content/types";

/**
 * Fixed, minimal nav. Transparent with chalk text over the hero; once scrolled
 * past the hero (~100vh) it becomes solid --void with a 1px --ash bottom
 * border. This is a class toggle driven by a passive scroll listener — never a
 * scroll-linked animation.
 *
 * JS-off: the <noscript> style forces the solid state so the bar stays legible.
 * The anchor links + Sign in collapse below md; the wordmark, Start and the
 * language toggle always remain.
 */
export function Nav({ content, homeHref }: { content: NavContent; homeHref: string }) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    // Toggle just before the full-viewport hero leaves the screen.
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "site-nav fixed inset-x-0 top-0 z-50 border-b text-chalk transition-colors duration-300 ease-quiet",
        solid ? "border-ash bg-void" : "border-transparent bg-transparent",
      )}
    >
      <noscript>
        <style>{`.site-nav{background:var(--void)!important;border-color:var(--ash)!important}`}</style>
      </noscript>

      <div className="shell flex h-16 items-center justify-between md:h-[72px]">
        <Link href={homeHref} className="t-wordmark" aria-label={content.wordmark}>
          {content.wordmark}
        </Link>

        <nav className="flex items-center gap-6 md:gap-9">
          <ul className="hidden items-center gap-9 md:flex">
            {content.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="link-quiet t-mono">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href={APP_SIGN_IN} className="link-quiet t-mono">
                {content.signIn}
              </a>
            </li>
          </ul>

          <LocaleToggle ariaLabel={content.localeSwitch} className="text-chalk" />

          <a
            href={APP_START}
            className="bg-blood px-5 py-[10px] font-mono text-[13px] font-medium uppercase tracking-mono leading-none text-chalk transition-colors duration-200 ease-quiet hover:bg-chalk hover:text-void"
          >
            {content.start}
          </a>
        </nav>
      </div>
    </header>
  );
}
