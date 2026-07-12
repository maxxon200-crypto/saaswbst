"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The scroll + reveal motion system, in one place. The complete motion budget:
 *   1. Lenis smooth scroll (default lerp 0.1), sharing ONE ticker with GSAP.
 *   2. Section entry — fade + rise 16px, 0.5s, power2.out, ScrollTrigger,
 *      once:true. Any [data-reveal] element; [data-reveal-delay] staggers.
 *   + smooth in-page anchor jumps.
 *
 * Hard rules:
 *   - Content is visible by default in CSS; we only animate FROM hidden at
 *     runtime. JS off → the page is complete and static.
 *   - prefers-reduced-motion: no Lenis, no reveals.
 *   - will-change is set on animation start and cleared on complete — never left on.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      targets.forEach((el) => {
        const delay = parseFloat(el.dataset.revealDelay ?? "0") || 0;
        gsap.from(el, {
          opacity: 0,
          y: 16,
          duration: 0.5,
          delay,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onStart: () => {
            el.style.willChange = "transform, opacity";
          },
          onComplete: () => {
            el.style.willChange = "auto";
          },
        });
      });
    });

    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -80 });
    };
    document.addEventListener("click", onAnchorClick);

    ScrollTrigger.refresh();

    return () => {
      document.removeEventListener("click", onAnchorClick);
      ctx.revert();
      gsap.ticker.remove(ticker);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
