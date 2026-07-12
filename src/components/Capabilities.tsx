import { cn } from "@/lib/cn";
import type { CapabilitiesContent, Capability } from "@/content/types";

/**
 * What it does — three full-bleed sections, one idea each, alternating
 * --bone / --void / --bone with hard cuts. Every visual is built from type,
 * rules and geometry (the site's own tokens) — zero imagery, zero stock.
 * Red appears exactly once per section: the extraction bracket, one brand,
 * one hairline in the spec book.
 */
export function Capabilities({ content }: { content: CapabilitiesContent }) {
  return (
    <div id="work">
      <Row dark={false} reverse={false} cap={content.reads} visual={<ReadsVisual />} />
      <Row
        dark
        reverse
        cap={content.library}
        visual={<LibraryVisual brands={content.library.brands} accent={content.library.brandAccentIndex} />}
      />
      <Row dark={false} reverse={false} cap={content.documents} visual={<SpecBookVisual book={content.specBook} />} />
    </div>
  );
}

function Row({
  dark,
  reverse,
  cap,
  visual,
}: {
  dark: boolean;
  reverse: boolean;
  cap: Capability;
  visual: React.ReactNode;
}) {
  return (
    <section className={cn(dark ? "bg-void text-chalk" : "bg-bone text-ink")}>
      <div className="shell grid items-center gap-14 py-24 md:py-[180px] lg:grid-cols-2 lg:gap-20">
        <div className={cn(reverse && "lg:order-2")}>
          <p className={cn("t-mono", dark ? "text-smoke" : "text-stone")}>{cap.index}</p>
          <h2 className="t-headline mt-6 max-w-[13ch] uppercase">{cap.title}</h2>
          <p className={cn("mt-8 max-w-[42ch] text-body", dark ? "text-smoke" : "text-stone")}>
            {cap.body}
          </p>
        </div>
        <div className={cn(reverse && "lg:order-1")}>{visual}</div>
      </div>
    </section>
  );
}

/* ---- Visual 01 — a stack of PDF pages, one spec value in a red bracket ---- */
function ReadsVisual() {
  const lines = [
    { k: "MODEL", v: "IC LIGHTS T1" },
    { k: "DIAMETER", v: "Ø 300 MM", mark: true },
    { k: "HEIGHT", v: "535 MM" },
    { k: "FINISH", v: "BRUSHED BRASS" },
    { k: "SOURCE", v: "1 × G9 LED" },
  ];
  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      {/* stacked pages behind */}
      <div className="absolute -right-3 top-3 h-full w-full border border-line bg-bone" aria-hidden />
      <div className="absolute -right-1.5 top-1.5 h-full w-full border border-line bg-surface" aria-hidden />
      {/* front page */}
      <div className="relative border border-ink bg-surface p-6">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <span className="font-mono text-[14px] font-bold tracking-[0.14em] text-ink">FLOS</span>
          <span className="t-mono text-stone">PDF</span>
        </div>
        <dl className="mt-4 space-y-3">
          {lines.map((l) => (
            <div key={l.k} className="flex items-baseline justify-between">
              <dt className="t-mono text-stone">{l.k}</dt>
              {l.mark ? (
                <dd className="relative px-2 py-0.5">
                  <span className="font-mono text-[13px] tracking-[0.06em] text-ink">{l.v}</span>
                  {/* red extraction bracket */}
                  <span aria-hidden className="absolute -left-0.5 -top-0.5 h-2.5 w-2.5 border-l-2 border-t-2 border-blood" />
                  <span aria-hidden className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 border-b-2 border-r-2 border-blood" />
                </dd>
              ) : (
                <dd className="font-mono text-[13px] tracking-[0.06em] text-ink">{l.v}</dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/* ---- Visual 02 — the brand list, one name in blood ---- */
function LibraryVisual({ brands, accent }: { brands: string[]; accent: number }) {
  return (
    <ul className="font-mono">
      {brands.map((b, i) => (
        <li
          key={b}
          className={cn(
            "border-b border-ash py-3 text-[clamp(26px,4.4vw,60px)] font-medium leading-none tracking-tight last:border-0",
            i === accent ? "text-blood" : "text-chalk",
          )}
        >
          {b}
        </li>
      ))}
    </ul>
  );
}

/* ---- Visual 03 — a spec-book page, typeset ---- */
function SpecBookVisual({
  book,
}: {
  book: CapabilitiesContent["specBook"];
}) {
  return (
    <div className="mx-auto w-full max-w-[440px] border border-ink bg-surface">
      <div className="flex items-center justify-between px-7 pt-7">
        <span className="t-mono text-stone">{book.studio}</span>
        <span className="t-mono text-stone">{book.footer}</span>
      </div>
      {/* the single blood hairline */}
      <div className="mx-7 mt-4 h-px bg-blood" />

      <div className="px-7 pb-8 pt-6">
        <p className="t-mono text-stone">{book.project}</p>
        <h3 className="mt-4 text-[clamp(28px,3.4vw,44px)] font-black uppercase leading-[0.95] tracking-tighter text-ink">
          {book.item}
        </h3>

        <dl className="mt-7">
          {book.rows.map((r) => (
            <div
              key={r.k}
              className="grid grid-cols-[110px_1fr] border-t border-line py-3 last:border-b"
            >
              <dt className="t-mono text-stone">{r.k}</dt>
              <dd className="font-mono text-[13px] tracking-[0.06em] text-ink">{r.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
