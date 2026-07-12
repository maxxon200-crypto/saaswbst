"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * The one flourish — a 12px ring that lerp-follows the pointer.
 *   · over links/buttons     → scales to 40px, fills blood at 20%
 *   · over the demo          → becomes a small mono "DRAG" mark
 *
 * Rules: desktop only (pointer: fine), off under prefers-reduced-motion, hidden
 * on touch. Position updates via transform: translate3d only, driven by a
 * single RAF with lerp — never top/left. The element is always rendered but
 * stays invisible until the effect activates it, so ref timing is never racy.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"default" | "hover" | "drag">("default");

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    const el = ref.current;
    if (!el) return;

    el.classList.add("cursor-active");
    document.documentElement.classList.add("has-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const cur = { x: pos.x, y: pos.y };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const t = e.target as HTMLElement | null;
      if (t?.closest('[data-cursor="drag"]')) setMode("drag");
      else if (t?.closest("a, button, [data-cursor]")) setMode("hover");
      else setMode("default");
    };

    const loop = () => {
      cur.x += (pos.x - cur.x) * 0.18;
      cur.y += (pos.y - cur.y) * 0.18;
      el.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      el.classList.remove("cursor-active");
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className={cn("cursor-root", mode)}>
      <span className="cursor-dot" />
      <span className="cursor-label">DRAG</span>
    </div>
  );
}
