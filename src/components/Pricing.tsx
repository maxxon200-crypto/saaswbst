import { Button } from "./Button";
import { APP_START } from "@/lib/links";
import type { PricingContent } from "@/content/types";

/**
 * Pricing — --bone, three columns separated by hairline rules (no cards, no
 * boxes, radius 0). Prices in huge mono. Red is spent once: the featured plan's
 * CTA. The other two CTAs are outline, which also points the eye at the middle.
 */
export function Pricing({ content }: { content: PricingContent }) {
  return (
    <section id="pricing" className="bg-bone text-ink">
      <div className="shell py-24 md:py-32">
        <div data-reveal className="mb-14 border-b border-line pb-6">
          <p className="t-mono text-stone">{content.label}</p>
        </div>

        <div className="grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {content.plans.map((plan) => (
            <div
              key={plan.name}
              data-reveal
              className="flex flex-col py-10 md:px-10 md:py-2 md:first:pl-0 md:last:pr-0"
            >
              <p className="t-mono mb-6 text-ink">{plan.featuredLabel ?? " "}</p>
              <p className="t-mono text-stone">{plan.name}</p>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="t-figure text-ink">{plan.price}</span>
                <span className="t-mono text-stone">{plan.cadence}</span>
              </p>

              <ul className="mt-9 flex-1 space-y-3">
                {plan.rows.map((row) => (
                  <li key={row} className="flex gap-3 text-body text-stone">
                    <span aria-hidden className="text-ink">
                      —
                    </span>
                    {row}
                  </li>
                ))}
              </ul>

              <Button
                href={APP_START}
                variant={plan.featuredLabel ? "primary" : "ghostInk"}
                className="mt-10 w-full"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <p data-reveal className="t-mono mt-12 text-stone">
          {content.note}
        </p>
      </div>
    </section>
  );
}
