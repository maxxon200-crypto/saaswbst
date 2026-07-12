"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The site's entire motion system, in one place.
 *
 *   - Lenis smooth scroll (duration 1.1)
 *   - Exactly one reveal effect: fade + rise (24px), 0.8s, power2.out, on
 *     section entry, via GSAP ScrollTrigger.
 *   - Lenis and ScrollTrigger share ONE RAF loop (gsap.ticker).
 *
 * Hard rules honoured here:
 *   - Content is visible by default in CSS. We only ever animate FROM a hidden
 *     state at runtime (gsap.from). With JS disabled nothing runs and the page
 *     renders complete.
 *   - prefers-reduced-motion: no Lenis, no reveals. Content is static + visible.
 *
 * Any element tagged `data-reveal` gets the effect. Add `data-reveal-delay` (in
 * seconds) to stagger siblings.
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

    // One RAF loop drives both Lenis and ScrollTrigger.
    lenis.on("scroll", ScrollTrigger.update);
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    // The single motion effect, scoped for clean teardown.
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      targets.forEach((el) => {
        const delay = parseFloat(el.dataset.revealDelay ?? "0") || 0;
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.8,
          delay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
      });
    });

    // Fonts settle after first paint; refresh so triggers use final positions.
    ScrollTrigger.refresh();

    return () => {
      ctx.revert(); // restores every target to its natural, visible state
      gsap.ticker.remove(ticker);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
