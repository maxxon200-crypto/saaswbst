/**
 * Milestone 1 proof page.
 *
 * Confirms the foundation renders: Gesso tokens, self-hosted Satoshi, and the
 * reveal motion (fade + rise) on [data-reveal] elements. Real sections replace
 * this in Milestone 2 onward. With JS disabled every element below stays fully
 * visible — nothing is authored at opacity:0.
 */
export default function Page({ params }: { params: { locale: string } }) {
  return (
    <main className="min-h-screen">
      <section className="shell flex min-h-screen flex-col justify-center gap-8 py-32">
        <p className="label" data-reveal>
          Milestone 1 — foundation
        </p>
        <h1
          className="max-w-[14ch] font-medium text-display leading-display tracking-display"
          data-reveal
          data-reveal-delay="0.05"
        >
          Specification, made <span className="text-accent">beautifully</span>.
        </h1>
        <p className="max-w-prose text-body text-ink" data-reveal data-reveal-delay="0.1">
          Tokens, Satoshi, and the reveal motion are wired. Locale is{" "}
          <span className="text-stone">{params.locale}</span>. Disable JavaScript
          and this page still renders complete.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4" data-reveal data-reveal-delay="0.15">
          <span className="border border-line bg-surface px-4 py-3 text-body">surface / line</span>
          <span className="bg-ink px-4 py-3 text-body text-paper">ink / paper</span>
          <span className="border border-line px-4 py-3 label">stone label</span>
        </div>
      </section>
    </main>
  );
}
