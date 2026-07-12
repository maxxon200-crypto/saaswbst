"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { APP_SIGN_IN, APP_START } from "@/lib/links";
import { Button } from "./Button";
import type { NavContent } from "@/content/types";

/**
 * Sticky nav. Transparent at the top; past 60px it gets a blurred, bordered
 * background via the .nav-scrolled class (the site's only backdrop-filter,
 * with a solid fallback). A passive scroll listener toggles the class — never a
 * scroll-linked animation. The nav element itself never animates.
 */
export function Nav({ content, homeHref }: { content: NavContent; homeHref: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-200",
        scrolled ? "nav-scrolled" : "border-b border-transparent",
      )}
    >
      <div className="shell flex h-14 items-center justify-between md:h-16">
        <Link href={homeHref} className="text-[16px] font-medium text-text">
          {content.wordmark}
        </Link>

        <nav className="flex items-center gap-5 md:gap-7">
          <ul className="hidden items-center gap-5 md:flex md:gap-7">
            {content.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="link-quiet text-[14px] text-text-dim">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href={APP_SIGN_IN} className="link-quiet text-[14px] text-text-dim">
                {content.signIn}
              </a>
            </li>
          </ul>

          <Button href={APP_START} size="sm">
            {content.start}
          </Button>
        </nav>
      </div>
    </header>
  );
}
