"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { PLAN_LABEL, type PlanTier } from "@/lib/db.types";

const NAV = [
  { href: "/projects", label: "Projects" },
  { href: "/library", label: "Library" },
  { href: "/settings", label: "Settings" },
];

/**
 * Persistent 240px sidebar on --surface with a 1px --line right border.
 * The active nav item is the only place --accent appears in the shell.
 */
export function Sidebar({
  studioName,
  plan,
}: {
  studioName: string;
  plan: PlanTier;
}) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-sidebar flex-col border-r border-line bg-surface">
      <div className="px-6 pt-7">
        <Link
          href="/projects"
          className="text-[15px] font-bold uppercase tracking-[0.22em] text-ink"
        >
          Metrica
        </Link>
      </div>

      <nav className="mt-10 flex-1 px-3">
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center rounded border-l-2 py-2 pl-3 pr-3 text-[15px] transition-colors",
                    active
                      ? "border-accent font-medium text-accent"
                      : "border-transparent text-ink hover:text-accent",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-line px-6 py-5">
        <p className="truncate text-[14px] font-medium text-ink">{studioName}</p>
        <p className="label mt-1">{PLAN_LABEL[plan]} plan</p>
      </div>
    </aside>
  );
}
