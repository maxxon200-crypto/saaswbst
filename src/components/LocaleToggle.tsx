"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/**
 * EN / IT switch. Preserves the current path when switching: the default
 * locale (en) lives at the clean root, IT carries an /it prefix. Colour is
 * inherited so it reads wherever it's placed.
 */
export function LocaleToggle({
  ariaLabel,
  className,
}: {
  ariaLabel: string;
  className?: string;
}) {
  const pathname = usePathname() || "/";

  const bare =
    pathname === "/it" ? "/" : pathname.startsWith("/it/") ? pathname.slice(3) : pathname;

  const enHref = bare;
  const itHref = bare === "/" ? "/it" : `/it${bare}`;
  const isIt = pathname === "/it" || pathname.startsWith("/it/");

  return (
    <nav aria-label={ariaLabel} className={cn("flex items-center gap-2 text-[14px]", className)}>
      <Link
        href={enHref}
        aria-current={!isIt ? "true" : undefined}
        className={cn("transition-colors", !isIt ? "text-text" : "text-text-dim hover:text-text")}
      >
        EN
      </Link>
      <span aria-hidden className="text-text-mute">
        ·
      </span>
      <Link
        href={itHref}
        aria-current={isIt ? "true" : undefined}
        className={cn("transition-colors", isIt ? "text-text" : "text-text-dim hover:text-text")}
      >
        IT
      </Link>
    </nav>
  );
}
