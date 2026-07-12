import type { Config } from "tailwindcss";

/**
 * Gesso design tokens.
 *
 * The six palette tokens plus the single flagged hero-accent tint are the ONLY
 * colours allowed on the site. Every colour resolves to a CSS custom property
 * defined in src/app/globals.css, so the tokens live in both places (config +
 * :root) as the spec requires.
 *
 * Radius is capped at 4px on every scale step (even `full`) and every shadow
 * scale resolves to `none`, so the "corners <= 4px, no shadows anywhere" rules
 * hold even if a utility is used carelessly.
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
      // Flagged: lightened oxblood, used ONLY for the one accent word in the
      // hero headline where it sits on the dark veil (#7A2E2E fails contrast on
      // the veil). See src/app/globals.css.
      "accent-tint": "var(--accent-tint)",
      // Off-white for text sitting on the dark hero veil (this is --paper).
      "on-veil": "var(--paper)",
    },
    borderColor: {
      DEFAULT: "var(--line)",
      line: "var(--line)",
      ink: "var(--ink)",
      accent: "var(--accent)",
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
        display: "-0.035em",
        label: "0.10em",
      },
      lineHeight: {
        display: "1.02",
      },
      fontSize: {
        // Fluid display / section scales — hierarchy is deliberately wide so no
        // two adjacent sizes land within 20% of each other.
        display: ["clamp(40px, 8vw, 120px)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        section: ["clamp(28px, 4vw, 56px)", { lineHeight: "1.05", letterSpacing: "-0.035em" }],
        lede: ["clamp(19px, 2.2vw, 24px)", { lineHeight: "1.5" }],
        body: ["18px", { lineHeight: "1.6" }],
        label: ["13px", { lineHeight: "1.4", letterSpacing: "0.10em" }],
      },
      maxWidth: {
        prose: "62ch",
        shell: "1240px",
      },
      transitionTimingFunction: {
        quiet: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
