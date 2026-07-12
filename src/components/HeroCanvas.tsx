"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * The one animated canvas on the entire site — a breathing topographic field of
 * ~2,500 dots (50×50). Every performance guard the brief demands:
 *
 *   · 30fps cap (delta accumulation, skips frames — half the cost of 60, and
 *     nobody can tell)
 *   · IntersectionObserver → cancelAnimationFrame when scrolled off-screen,
 *     restart on re-entry; also pauses on tab hide
 *   · devicePixelRatio capped at 1.5 (retina at full DPR is what kills laptops)
 *   · NOT mounted below 768px or under prefers-reduced-motion — the static SVG
 *     frame (rendered here on the server) shows instead
 *   · zero per-frame allocation: the grid is precomputed into typed arrays; the
 *     loop only reads them and updates y + globalAlpha. No new, no map/filter.
 *   · animates the canvas bitmap only — no CSS transform on it, so no will-change
 *
 * The <img> static frame is server-rendered and always present, so JS-off (and
 * mobile, and reduced-motion) get the complete wave with no scripting.
 */
export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (desktop && !reduced) setActive(true);
  }, []);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COLS = 50;
    const ROWS = 50;
    const N = COLS * ROWS;
    const TAU = Math.PI * 2;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);

    // Precomputed once — never reallocated inside the loop.
    const fx = new Float32Array(N);
    const fy = new Float32Array(N);
    const bx = new Float32Array(N);
    const by = new Float32Array(N);
    for (let j = 0; j < ROWS; j++) {
      for (let i = 0; i < COLS; i++) {
        const idx = j * COLS + i;
        fx[idx] = i / (COLS - 1);
        fy[idx] = j / (ROWS - 1);
      }
    }

    let cssW = 0;
    let cssH = 0;
    let amp = 0;
    let dotR = 1.6;
    let grad: CanvasGradient | null = null;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
      canvas.width = Math.round(cssW * DPR);
      canvas.height = Math.round(cssH * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const marginX = cssW / COLS / 2;
      const marginY = cssH / ROWS / 2;
      const spanX = cssW - marginX * 2;
      const spanY = cssH - marginY * 2;
      amp = Math.max(cssW, cssH) * 0.014;
      dotR = Math.max(1.9, cssW * 0.0018);
      for (let idx = 0; idx < N; idx++) {
        bx[idx] = marginX + fx[idx] * spanX;
        by[idx] = marginY + fy[idx] * spanY;
      }
      grad = ctx.createRadialGradient(
        cssW / 2,
        cssH * 0.42,
        Math.min(cssW, cssH) * 0.1,
        cssW / 2,
        cssH * 0.42,
        Math.max(cssW, cssH) * 0.72,
      );
      grad.addColorStop(0.45, "rgba(12,12,12,0)");
      grad.addColorStop(1, "rgba(12,12,12,0.85)");
    };

    const FRAME_MS = 1000 / 30;
    let last = 0;
    let t = 0;
    let raf = 0;
    let drawing = false;
    let onScreen = true;

    const frame = (now: number) => {
      if (!drawing) return;
      raf = requestAnimationFrame(frame);
      if (now - last < FRAME_MS) return; // 30fps throttle
      const dt = now - last;
      last = now;
      t += dt * 0.0006;

      ctx.clearRect(0, 0, cssW, cssH);
      ctx.fillStyle = "#f2f0ed";
      for (let idx = 0; idx < N; idx++) {
        const a = fx[idx];
        const b = fy[idx];
        const w =
          0.5 * Math.sin(a * TAU * 1.5 + t) +
          0.5 * Math.sin(b * TAU * 1.2 - t * 0.8) +
          0.5 * Math.sin((a + b) * TAU * 0.8 + t * 0.5);
        const norm = w * 0.3333 * 0.5 + 0.5; // → ~[0,1]
        // Kept below the --smoke text brightness so the wave stays subordinate.
        ctx.globalAlpha = 0.1 + (norm < 0 ? 0 : norm > 1 ? 1 : norm) * 0.42;
        ctx.beginPath();
        ctx.arc(bx[idx], by[idx] + w * amp, dotR, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (grad) {
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cssW, cssH);
      }
    };

    const sync = () => {
      const shouldRun = onScreen && !document.hidden;
      if (shouldRun && !drawing) {
        drawing = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && drawing) {
        drawing = false;
        cancelAnimationFrame(raf);
      }
    };

    resize();

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? true;
        sync();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => sync();
    const onResize = () => resize();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);

    sync();

    return () => {
      drawing = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, [active]);

  return (
    // z-0 (not -z-10): a negative z-index would paint the backdrop BEHIND the
    // section's opaque --void background and hide it entirely.
    <div className="absolute inset-0 z-0 overflow-hidden bg-void">
      {/* Static frame — server-rendered, always present. Hidden once the canvas
          takes over on capable desktops. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero-wave.svg"
        alt=""
        width={1600}
        height={900}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-500",
          active && "opacity-0",
        )}
      />
      {active && <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />}
    </div>
  );
}
