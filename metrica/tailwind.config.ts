import type { Config } from "tailwindcss";

/**
 * Gesso design tokens for the Metrica application.
 *
 * Six palette tokens + two functional status colours are the ONLY colours
 * allowed on screen. Everything resolves to a CSS custom property defined in
 * src/app/globals.css, so tokens live in both places (config + :root).
 *
 * Radius is capped at 4px on every step (even `full`) and every shadow step
 * resolves to `none` — the "corners <= 4px, no shadows anywhere" rules hold
 * even under careless utility use.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      paper: "var(--paper)",
      surface: "var(--surface)",
      ink: "var(--ink)",
      stone: "var(--stone)",
      line: "var(--line)",
      accent: "var(--accent)",
      positive: "var(--positive)",
      negative: "var(--negative)",
    },
    borderColor: {
      DEFAULT: "var(--line)",
      line: "var(--line)",
      ink: "var(--ink)",
      accent: "var(--accent)",
      positive: "var(--positive)",
      negative: "var(--negative)",
      transparent: "transparent",
      current: "currentColor",
    },
    borderRadius: {
      none: "0px",
      sm: "2px",
      DEFAULT: "4px",
      md: "4px",
      lg: "4px",
      xl: "4px",
      "2xl": "4px",
      "3xl": "4px",
      full: "4px",
    },
    boxShadow: {
      none: "none",
      sm: "none",
      DEFAULT: "none",
      md: "none",
      lg: "none",
      xl: "none",
      "2xl": "none",
      inner: "none",
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-satoshi)", "sans-serif"],
        satoshi: ["var(--font-satoshi)", "sans-serif"],
      },
      letterSpacing: {
        title: "-0.03em",
        label: "0.10em",
      },
      fontSize: {
        // App scales are calmer than the marketing site.
        page: ["clamp(32px, 4vw, 40px)", { lineHeight: "1.08", letterSpacing: "-0.03em" }],
        heading: ["clamp(20px, 2.4vw, 24px)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        body: ["17px", { lineHeight: "1.55" }],
        label: ["13px", { lineHeight: "1.3", letterSpacing: "0.10em" }],
      },
      spacing: {
        sidebar: "240px",
      },
      transitionTimingFunction: {
        quiet: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
