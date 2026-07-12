import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outlineInk" | "outlineLight";

const base =
  "inline-flex items-center justify-center rounded-none px-7 py-4 text-[15px] font-medium leading-none tracking-[0.01em] transition-colors duration-200 ease-quiet";

const variants: Record<Variant, string> = {
  // The primary CTA — one of the only three permitted accent usages.
  primary: "bg-accent text-paper hover:opacity-90",
  // Secondary on a light surface.
  outlineInk: "border border-ink text-ink hover:bg-ink hover:text-paper",
  // Secondary over the dark hero veil: 1px off-white border, transparent fill.
  outlineLight:
    "border border-paper text-paper hover:bg-paper hover:text-ink",
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
