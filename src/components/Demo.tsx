"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { DemoContent } from "@/content/types";

/**
 * The centrepiece. A manufacturer PDF cut-sheet (built in HTML/CSS/SVG) feeds an
 * empty schedule: on scroll into view the sheet nudges toward the schedule and
 * the fields type in, one by one, each landing with a blood underline that
 * fades. ~2.5s. Scripted — zero API, zero latency, works offline.
 *
 * Performance: the type-in writes to `textContent` via refs inside a single GSAP
 * timeline — never a React re-render per character. will-change is set on the
 * animated elements for the run and cleared on complete.
 *
 * JS-off / reduced-motion: the schedule renders already filled (values are the
 * default DOM content). The effect only CLEARS them to replay the reveal when
 * motion is allowed — content is complete by default.
 */
export function Demo({ content }: { content: DemoContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const underRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const run = useCallback(() => {
    tlRef.current?.kill();
    const pdf = pdfRef.current;
    const values = content.values;

    const animated: HTMLElement[] = [];
    if (pdf) animated.push(pdf);
    underRefs.current.forEach((u) => u && animated.push(u));
    animated.forEach((el) => (el.style.willChange = "transform, opacity"));

    const tl = gsap.timeline({
      onComplete: () => animated.forEach((el) => (el.style.willChange = "auto")),
    });
    tlRef.current = tl;

    if (pdf) {
      tl.fromTo(
        pdf,
        { xPercent: 0, rotate: -4 },
        { xPercent: 6, rotate: -2.5, duration: 0.6, ease: "power2.out" },
        0,
      );
    }

    values.forEach((val, i) => {
      const at = 0.4 + i * 0.35;
      const cell = valueRefs.current[i];
      const under = underRefs.current[i];
      if (cell) {
        const proxy = { p: 0 };
        cell.textContent = "";
        tl.to(
          proxy,
          {
            p: 1,
            duration: 0.3,
            ease: "none",
            onUpdate: () => {
              cell.textContent = val.slice(0, Math.round(proxy.p * val.length));
            },
          },
          at,
        );
      }
      if (under) {
        tl.fromTo(
          under,
          { scaleX: 0, opacity: 1 },
          { scaleX: 1, duration: 0.3, ease: "power2.out" },
          at,
        ).to(under, { opacity: 0, duration: 0.4, ease: "power1.out" }, at + 0.3);
      }
    });
  }, [content.values]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // leave the schedule filled + static

    gsap.registerPlugin(ScrollTrigger);

    // Reset to the hidden (empty) state now that JS owns the reveal.
    valueRefs.current.forEach((c) => c && (c.textContent = ""));
    underRefs.current.forEach((u) => {
      if (u) {
        u.style.transform = "scaleX(0)";
        u.style.opacity = "0";
      }
    });

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 68%",
      once: true,
      onEnter: run,
    });

    return () => {
      st.kill();
      tlRef.current?.kill();
    };
  }, [run]);

  return (
    <section
      ref={sectionRef}
      id="mechanism"
      data-cursor="drag"
      className="bg-bone text-ink"
    >
      <div className="shell py-24 md:py-32">
        <div
          data-reveal
          className="mb-12 flex items-baseline justify-between border-b border-line pb-6"
        >
          <p className="t-mono text-stone">{content.label}</p>
          <p className="t-mono hidden text-stone sm:block">FIG. 01</p>
        </div>

        <h2 data-reveal className="t-headline mb-16 max-w-[15ch] uppercase">
          {content.headline}
        </h2>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ---- The cut-sheet ---- */}
          <div data-reveal className="flex justify-center lg:justify-start">
            <div
              ref={pdfRef}
              className="w-full max-w-[420px] -rotate-[4deg] border border-ink bg-surface"
            >
              <div className="flex items-center justify-between border-b border-ink px-5 py-3">
                <span className="font-mono text-[15px] font-bold tracking-[0.14em] text-ink">
                  FLOS
                </span>
                <span className="t-mono text-stone">{content.sheet.docType}</span>
              </div>

              <div className="grid grid-cols-[1fr_1.1fr]">
                <div className="border-r border-line p-5">
                  <ProductDrawing />
                </div>
                <dl className="p-5">
                  {content.sheet.specs.map((s) => (
                    <div
                      key={s.k}
                      className="flex items-baseline justify-between gap-3 border-b border-line py-[7px] last:border-0"
                    >
                      <dt className="t-mono shrink-0 text-stone">{s.k}</dt>
                      <dd className="text-right font-mono text-[12px] leading-tight tracking-[0.04em] text-ink">
                        {s.v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="border-t border-ink px-5 py-2.5">
                <span className="t-mono text-stone">{content.sheet.designer}</span>
              </div>
            </div>
          </div>

          {/* ---- The schedule ---- */}
          <div data-reveal>
            <div className="border border-ink">
              <div className="flex items-center justify-between bg-ink px-5 py-3">
                <span className="t-mono text-bone">Schedule — 001</span>
                <span className="t-mono text-smoke">Metrica</span>
              </div>
              <div>
                {content.columns.map((col, i) => (
                  <div
                    key={col}
                    className="grid grid-cols-[128px_1fr] items-center border-b border-line last:border-0"
                  >
                    <span className="t-mono border-r border-line px-4 py-4 text-stone sm:px-5">
                      {col}
                    </span>
                    <span className="relative px-4 py-4 sm:px-5">
                      <span
                        ref={(el) => {
                          valueRefs.current[i] = el;
                        }}
                        className="font-mono text-[13px] tracking-[0.06em] text-ink"
                      >
                        {content.values[i]}
                      </span>
                      {/* blood underline flash */}
                      <span
                        aria-hidden
                        ref={(el) => {
                          underRefs.current[i] = el;
                        }}
                        className="absolute bottom-3 left-4 right-4 h-px origin-left bg-blood sm:left-5 sm:right-5"
                      />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-mono text-stone">{content.caption}</p>
          <button
            type="button"
            onClick={run}
            className="t-mono inline-flex items-center gap-2 self-start border border-ink px-4 py-2.5 text-ink transition-colors duration-200 ease-quiet hover:bg-ink hover:text-bone sm:self-auto"
          >
            {content.replay}
            <span aria-hidden>↺</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/** IC Lights T1 — a blown-glass globe balanced on a brass rod, drawn as a
 *  technical silhouette with dimension lines. Pure SVG, token strokes. */
function ProductDrawing() {
  return (
    <svg
      viewBox="0 0 200 300"
      className="h-auto w-full"
      role="img"
      aria-label="IC Lights T1 table lamp — technical drawing"
    >
      {/* dimension line — height */}
      <g stroke="var(--stone)" strokeWidth="1">
        <line x1="28" y1="40" x2="28" y2="262" />
        <line x1="24" y1="40" x2="32" y2="40" />
        <line x1="24" y1="262" x2="32" y2="262" />
      </g>
      <text
        x="20"
        y="155"
        fill="var(--stone)"
        fontFamily="var(--font-mono), monospace"
        fontSize="9"
        letterSpacing="1"
        transform="rotate(-90 20 155)"
        textAnchor="middle"
      >
        535 MM
      </text>

      {/* the lamp */}
      <g stroke="var(--ink)" strokeWidth="1.4" fill="none">
        {/* globe */}
        <circle cx="112" cy="92" r="52" />
        {/* rod */}
        <line x1="112" y1="144" x2="112" y2="248" />
        {/* base */}
        <ellipse cx="112" cy="252" rx="34" ry="8" />
      </g>

      {/* dimension line — diameter */}
      <g stroke="var(--stone)" strokeWidth="1">
        <line x1="60" y1="282" x2="164" y2="282" />
        <line x1="60" y1="278" x2="60" y2="286" />
        <line x1="164" y1="278" x2="164" y2="286" />
      </g>
      <text
        x="112"
        y="296"
        fill="var(--stone)"
        fontFamily="var(--font-mono), monospace"
        fontSize="9"
        letterSpacing="1"
        textAnchor="middle"
      >
        Ø 300 MM
      </text>
    </svg>
  );
}
