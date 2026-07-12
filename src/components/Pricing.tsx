import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { APP_START } from "@/lib/links";
import type { PricingContent } from "@/content/types";

/**
 * Pricing — three equal cards. White is the accent: the featured (Studio) card
 * carries a POPULAR label, a slightly stronger border, and the one filled
 * button; the others are outlined. No checkmarks, no bullets — just lines.
 */
export function Pricing({ content }: { content: PricingContent }) {
  return (
    <section id="pricing" className="bg-bg py-24 md:py-32">
      <div className="shell">
        <div data-reveal className="mx-auto max-w-[720px] text-center">
          <h2 className="t-h2">{content.heading}</h2>
          <p className="mt-4 text-[17px] text-text-dim">{content.subheading}</p>
        </div>

        <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-3">
          {content.plans.map((plan) => (
            <div
              key={plan.name}
              data-reveal
              className={cn(
                "flex flex-col rounded-xl border bg-surface p-8",
                plan.featuredLabel ? "border-strong" : "border-hairline",
              )}
            >
              <p className="t-label">{plan.featuredLabel ?? " "}</p>
              <h3 className="mt-1 text-[19px] font-medium text-text">{plan.name}</h3>

              <p className="mt-4 flex items-baseline gap-1.5">
                <span className="text-[34px] font-semibold leading-none text-text">
                  {plan.price}
                </span>
                <span className="text-[15px] text-text-dim">{plan.cadence}</span>
              </p>

              <ul className="mt-7 flex flex-1 flex-col gap-2.5 text-[15px] text-text-dim">
                {plan.rows.map((row) => (
                  <li key={row}>{row}</li>
                ))}
              </ul>

              <Button
                href={APP_START}
                variant={plan.featuredLabel ? "primary" : "outline"}
                className="mt-8 w-full"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <p data-reveal className="mt-8 text-center text-[13px] text-text-mute">
          {content.note}
        </p>
      </div>
    </section>
  );
}
