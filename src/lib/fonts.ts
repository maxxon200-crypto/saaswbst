import localFont from "next/font/local";

/**
 * Satoshi Variable — the ONLY typeface on the site (no serif, no fallback
 * display face). Self-hosted from /public/fonts, loaded and optimised by
 * next/font/local. The woff2 carries a single `wght` axis spanning 300–900,
 * which covers every weight the design uses (400 body, 500–700 display).
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
  // Generic fallback only for the brief swap window — never a display face.
  fallback: ["sans-serif"],
});
