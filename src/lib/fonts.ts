import localFont from "next/font/local";

/**
 * Two typefaces, both self-hosted from /public/fonts via next/font/local.
 * No serif, no system-ui as display, no third face.
 *
 *   Satoshi Variable  — display + UI + body. One woff2, wght axis 300–900,
 *                       which covers the 900 the hero demands and the 400/500
 *                       used for body and labels.
 *   JetBrains Mono    — data / technical. Labels, specs, dimensions, prices,
 *                       section markers. This is what makes the site read as a
 *                       technical drawing rather than a fashion parody. Latin
 *                       subset (covers €, Italian accents) kept small.
 */
export const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-satoshi",
  preload: true,
  fallback: ["sans-serif"],
});

export const mono = localFont({
  src: [
    {
      path: "../../public/fonts/JetBrainsMono-Variable.woff2",
      weight: "100 800",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-mono",
  preload: true,
  fallback: ["ui-monospace", "monospace"],
});
