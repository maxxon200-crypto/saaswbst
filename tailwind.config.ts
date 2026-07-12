import type { Config } from "tailwindcss";

/**
 * METRICA — Marketing tokens. Charcoal + white, no accent colour, no shadows
 * (depth is layering). System font stack only — NO webfont is loaded for text.
 * The application (metrica/) keeps its own Gesso tokens and is never touched.
 *
 * Colours resolve to CSS custom properties scoped under
 * [data-zone="marketing"] in src/app/globals.css.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      bg: "var(--bg)",
      surface: "var(--surface)",
      "surface-2": "var(--surface-2)",
      text: "var(--text)",
      "text-dim": "var(--text-dim)",
      "text-mute": "var(--text-mute)",
    },
    borderColor: {
      DEFAULT: "var(--border)",
      hairline: "var(--border)",
      strong: "var(--border-strong)",
      text: "var(--text)",
      transparent: "transparent",
      current: "currentColor",
    },
    // Soft, modern, Apple: 10px on buttons (rounded-lg), 12px on cards/panels
    // and the video frame (rounded-xl). Nothing sharp, nothing fully round.
    borderRadius: {
      none: "0px",
      sm: "6px",
      DEFAULT: "10px",
      md: "8px",
      lg: "10px",
      xl: "12px",
      "2xl": "16px",
      full: "9999px",
    },
    // No shadows anywhere. Depth is contrast + layering.
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
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      // Only the weights the design uses. Nothing above 600.
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
      },
      maxWidth: {
        content: "1200px",
        video: "1000px",
        panel: "1100px",
      },
      transitionTimingFunction: {
        quiet: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
