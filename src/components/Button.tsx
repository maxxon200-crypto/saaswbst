import { cn } from "@/lib/cn";

type Variant = "primary" | "outline";
type Size = "sm" | "md";

/**
 * The site's button. Plain <a> — CTAs cross into the app (a full navigation)
 * and in-page anchors are handled by Lenis. White is the accent: the primary
 * button is a white fill with --bg text. One 0.15s hover transition.
 */
const base =
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium leading-none transition-colors duration-150 ease-quiet";

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[14px]",
  md: "px-5 py-3 text-[15px]",
};

const variants: Record<Variant, string> = {
  primary: "bg-text text-bg hover:bg-text-dim",
  outline: "border border-hairline text-text hover:bg-surface-2",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </a>
  );
}
