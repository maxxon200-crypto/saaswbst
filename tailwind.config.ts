import type { Config } from "tailwindcss";

/**
 * METRICA — Marketing zone tokens ("Editorial Brutalism").
 *
 * This is the PUBLIC marketing site only. The application (the `metrica/`
 * project) keeps its own Gesso tokens and is never touched by anything here.
 *
 * Every colour resolves to a CSS custom property defined — and scoped under
 * `[data-zone="marketing"]` — in src/app/globals.css. The two design languages
 * are deliberately different: the marketing site is the poster, the app is the
 * instrument.
 *
 * Form language is enforced structurally: radius is 0 on every scale step and
 * every shadow resolves to `none`, so "sharp corners, no shadows" holds even if
 * a utility is used carelessly.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",

      /* Dark zone */
      void: "var(--void)",
      carbon: "var(--carbon)",
      ash: "var(--ash)",
      smoke: "var(--smoke)",
      chalk: "var(--chalk)",

      /* Light zone */
      bone: "var(--bone)",
      surface: "var(--surface)",
      ink: "var(--ink)",
      stone: "var(--stone)",
      line: "var(--line)",

      /* The one accent — a scalpel, not a paintbrush. */
      blood: "var(--blood)",
    },
    borderColor: {
      DEFAULT: "var(--line)",
      line: "var(--line)",
      ash: "var(--ash)",
      ink: "var(--ink)",
      chalk: "var(--chalk)",
      blood: "var(--blood)",
      smoke: "var(--smoke)",
      transparent: "transparent",
      current: "currentColor",
    },
    // Radius 0 everywhere. The only round thing on the site is the cursor mark,
    // which is drawn as a discrete element, not via these utilities.
    borderRadius: {
      none: "0px",
      sm: "0px",
      DEFAULT: "0px",
      md: "0px",
      lg: "0px",
      xl: "0px",
      "2xl": "0px",
      "3xl": "0px",
      full: "0px",
    },
    // No shadows. Depth is contrast and layering, never blur.
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
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.05em",
        tighter: "-0.04em",
        mono: "0.12em",
        wordmark: "0.2em",
      },
      fontSize: {
        // Hierarchy is brutal — no two adjacent scales sit within 20%.
        hero: ["clamp(56px, 11vw, 180px)", { lineHeight: "0.88", letterSpacing: "-0.05em" }],
        headline: ["clamp(40px, 6.5vw, 96px)", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        figure: ["clamp(44px, 7vw, 104px)", { lineHeight: "0.92", letterSpacing: "-0.02em" }],
        lede: ["clamp(18px, 1.4vw, 20px)", { lineHeight: "1.55" }],
        body: ["18px", { lineHeight: "1.6" }],
        mono: ["13px", { lineHeight: "1.4", letterSpacing: "0.12em" }],
        "mono-sm": ["12px", { lineHeight: "1.4", letterSpacing: "0.12em" }],
      },
      maxWidth: {
        shell: "1440px",
      },
      transitionTimingFunction: {
        quiet: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
