/**
 * Generates /public/images/hero-wave.svg — a single static frame of the hero's
 * dot wave field. This is the fallback shown on mobile (<768px), under
 * prefers-reduced-motion, and with JS disabled, where the animated canvas never
 * mounts. Built from pure geometry (no native deps, no raster), it matches the
 * canvas field's t=0 slice so the two never look like different artworks.
 *
 * Run: node scripts/gen-hero-wave.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "images", "hero-wave.svg");

const W = 1600;
const H = 900;
const COLS = 46;
const ROWS = 24;
const AMP = 30; // vertical wave amplitude (px)
const R = 2.8; // dot radius
const TAU = Math.PI * 2;

// Shared field function (t=0 here; the canvas advances t). Returns [-~1.5, ~1.5].
function wave(fx, fy) {
  return (
    0.5 * Math.sin(fx * TAU * 1.5) +
    0.5 * Math.sin(fy * TAU * 1.2) +
    0.5 * Math.sin((fx + fy) * TAU * 0.8)
  );
}

let dots = "";
const marginX = W / COLS / 2;
const marginY = H / ROWS / 2;
for (let j = 0; j < ROWS; j++) {
  for (let i = 0; i < COLS; i++) {
    const fx = i / (COLS - 1);
    const fy = j / (ROWS - 1);
    const x = marginX + fx * (W - marginX * 2);
    const y = marginY + fy * (H - marginY * 2);
    const w = wave(fx, fy);
    const yy = (y + w * AMP).toFixed(1);
    const alpha = (0.11 + (w * 0.5 + 0.5) * 0.44).toFixed(2);
    dots += `<circle cx="${x.toFixed(1)}" cy="${yy}" r="${R}" fill="#f2f0ed" opacity="${alpha}"/>`;
  }
}

// Radial vignette baked in, so the static frame reads with the same depth as
// the canvas render.
const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="">` +
  `<defs><radialGradient id="v" cx="50%" cy="42%" r="72%">` +
  `<stop offset="45%" stop-color="#0c0c0c" stop-opacity="0"/>` +
  `<stop offset="100%" stop-color="#0c0c0c" stop-opacity="0.85"/>` +
  `</radialGradient></defs>` +
  `<rect width="${W}" height="${H}" fill="#0c0c0c"/>` +
  `<g>${dots}</g>` +
  `<rect width="${W}" height="${H}" fill="url(#v)"/>` +
  `</svg>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, svg);
console.log(`Wrote ${OUT} (${(svg.length / 1024).toFixed(1)} KB, ${COLS * ROWS} dots)`);
