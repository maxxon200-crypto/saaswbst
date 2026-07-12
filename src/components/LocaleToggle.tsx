"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/**
 * EN / IT switch. Preserves the current path when switching: the default
 * locale (en) lives at the clean root, IT carries an /it prefix.
 */
export function LocaleToggle({
  ariaLabel,
  className,
}: {
  ariaLabel: string;
  className?: string;
}) {
  const pathname = usePathname() || "/";

  // Strip an existing /it prefix down to the bare, locale-less path.
  const bare =
    pathname === "/it" ? "/" : pathname.startsWith("/it/") ? pathname.slice(3) : pathname;

  const enHref = bare;
  const itHref = bare === "/" ? "/it" : `/it${bare}`;
  const isIt = pathname === "/it" || pathname.startsWith("/it/");

  return (
    <nav aria-label={ariaLabel} className={cn("flex items-center gap-2", className)}>
      <Link
        href={enHref}
        aria-current={!isIt ? "true" : undefined}
        className={cn(
          "text-[13px] tracking-label transition-colors",
          !isIt ? "opacity-100" : "opacity-55 hover:opacity-100",
        )}
      >
        EN
      </Link>
      <span aria-hidden className="text-[13px] opacity-40">
        /
      </span>
      <Link
        href={itHref}
        aria-current={isIt ? "true" : undefined}
        className={cn(
          "text-[13px] tracking-label transition-colors",
          isIt ? "opacity-100" : "opacity-55 hover:opacity-100",
        )}
      >
        IT
      </Link>
    </nav>
  );
}
