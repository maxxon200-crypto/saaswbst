import type { ProblemContent } from "@/content/types";

/**
 * The problem — --void, three hairline-divided columns, each a huge mono figure
 * over two lines of --smoke body. The visible baseline grid sits behind it:
 * technical-drawing energy. No icons, no decoration.
 */
export function Problem({ content }: { content: ProblemContent }) {
  return (
    <section id="problem" className="relative overflow-hidden bg-void text-chalk">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />

      <div className="shell relative py-24 md:py-32">
        <div data-reveal className="mb-14 border-b border-ash pb-6">
          <p className="t-mono text-smoke">{content.label}</p>
        </div>

        <div className="grid divide-y divide-ash md:grid-cols-3 md:divide-x md:divide-y-0">
          {content.columns.map((col) => (
            <div
              key={col.figure}
              data-reveal
              className="py-10 md:px-8 md:py-4 md:first:pl-0 md:last:pr-0"
            >
              <p className="t-figure uppercase text-chalk">{col.figure}</p>
              <p className="mt-6 max-w-[32ch] text-smoke">{col.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
