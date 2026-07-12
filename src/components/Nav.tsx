"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { LocaleToggle } from "./LocaleToggle";
import type { NavContent } from "@/content/types";

/**
 * Fixed nav. Transparent with off-white text over the hero; after any scroll it
 * becomes --paper with a 1px --line bottom border and ink text.
 *
 * JS-off behaviour: the <noscript> block below forces the solid state, so with
 * scripting disabled the nav stays readable over every section (the transparent
 * overlay is a progressive enhancement, not load-bearing).
 *
 * The three anchor links are shown from `md` up only; on phones the bar keeps
 * the wordmark and the language toggle, and sections are reached by scrolling.
 * (Simplest option where the spec is silent — no hamburger invented.)
 */
export function Nav({
  content,
  homeHref,
}: {
  content: NavContent;
  homeHref: string;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "site-nav fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ease-quiet",
        scrolled
          ? "border-line bg-paper text-ink"
          : "border-transparent bg-transparent text-paper",
      )}
    >
      <noscript>
        {/* Force the solid, readable state when JS is unavailable. */}
        <style>{`.site-nav{background:var(--paper)!important;color:var(--ink)!important;border-color:var(--line)!important}`}</style>
      </noscript>

      <div className="shell flex h-16 items-center justify-between md:h-20">
        <Link
          href={homeHref}
          className="text-[15px] font-bold uppercase tracking-[0.22em]"
          aria-label={content.wordmark}
        >
          {content.wordmark}
        </Link>

        <div className="flex items-center gap-6 md:gap-8">
          <ul className="hidden items-center gap-6 md:flex lg:gap-8">
            {content.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-quiet text-[15px]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <LocaleToggle ariaLabel={content.localeSwitch} />
        </div>
      </div>
    </header>
  );
}
