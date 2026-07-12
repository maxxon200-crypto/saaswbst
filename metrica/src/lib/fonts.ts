import localFont from "next/font/local";

/**
 * Satoshi Variable — the ONLY typeface in Metrica (no serif, no system display
 * face). Self-hosted from /public/fonts, single `wght` axis 300–900 covering
 * every weight the app uses (400 body, 500 headings, 600 page titles).
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
