import type { SocialProofContent } from "@/content/types";

/**
 * Social proof — one line. Metrica has no customer logos yet, so it shows the
 * pre-loaded brand library instead: honest, and it says something true about
 * the product. Brand names only — no logos, no boxes.
 */
export function SocialProof({ content }: { content: SocialProofContent }) {
  return (
    <section className="bg-bg py-20 md:py-24">
      <div className="shell text-center">
        <p data-reveal className="text-[13px] text-text-mute">
          {content.lead}
        </p>
        <div
          data-reveal
          className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[15px] tracking-wide text-text-dim"
        >
          {content.brands.map((brand, i) => (
            <span key={brand} className="flex items-center gap-x-4">
              {i > 0 && (
                <span aria-hidden className="text-text-mute">
                  ·
                </span>
              )}
              {brand}
            </span>
          ))}
        </div>
        <p data-reveal className="mt-6 text-[13px] text-text-mute">
          {content.caption}
        </p>
      </div>
    </section>
  );
}
