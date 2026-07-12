"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The scroll + reveal motion system, in one place.
 *
 * Motion budget honoured here:
 *   2. Section entry — fade + rise 32px, 0.9s, power3.out, ScrollTrigger,
 *      once:true (never re-triggers). Any [data-reveal] element gets it;
 *      [data-reveal-delay] (seconds) staggers siblings.
 *   5/anchor — Lenis smooth scroll + smooth in-page anchor jumps.
 *
 * Lenis and ScrollTrigger share ONE RAF loop (gsap.ticker).
 *
 * Hard rules:
 *   - Content is visible by default in CSS; we only animate FROM hidden at
 *     runtime. JS off → the page is complete and static.
 *   - prefers-reduced-motion: no Lenis, no reveals, content static + visible.
 *   - will-change is applied on animation start and removed on complete —
 *     never left permanent.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return; // content stays visible + static

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

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
          y: 32,
          duration: 0.9,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onStart: () => {
            el.style.willChange = "transform, opacity";
          },
          onComplete: () => {
            // Never leave will-change on — it eats GPU memory.
            el.style.willChange = "auto";
          },
        });
      });
    });

    // Smooth in-page anchor jumps (Sign-in/CTAs stay full navigations).
    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -72 });
    };
    document.addEventListener("click", onAnchorClick);

    // Fonts settle after first paint; refresh so triggers use final positions.
    ScrollTrigger.refresh();

    return () => {
      document.removeEventListener("click", onAnchorClick);
      ctx.revert(); // restores every target to its natural, visible state
      gsap.ticker.remove(ticker);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
