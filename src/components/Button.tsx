import { cn } from "@/lib/cn";

type Variant = "primary" | "ghostChalk" | "ghostInk";

/**
 * The site's only button. Renders a plain <a> — CTAs cross into the app
 * (a full navigation), and in-page anchors are handled by Lenis. Radius 0,
 * mono caps, one 0.2s colour transition on hover. Nothing else moves.
 */
const base =
  "inline-flex items-center justify-center whitespace-nowrap font-mono uppercase tracking-mono text-[13px] font-medium px-7 py-[18px] leading-none transition-colors duration-200 ease-quiet";

const variants: Record<Variant, string> = {
  // The primary CTA — one of the few permitted accent usages.
  primary: "bg-blood text-chalk hover:bg-ink",
  // Secondary over the dark hero: 1px chalk border, transparent fill.
  ghostChalk: "border border-chalk text-chalk hover:bg-chalk hover:text-void",
  // Secondary on a light surface.
  ghostInk: "border border-ink text-ink hover:bg-ink hover:text-bone",
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </a>
  );
}
