import { Button } from "./Button";
import { HeroCanvas } from "./HeroCanvas";
import { APP_START } from "@/lib/links";
import type { HeroContent } from "@/content/types";

/**
 * The one moment of theatre. Full viewport, --void ground, headline bottom-left
 * at hero scale. Deliberately NOT reveal-animated — it holds the LCP text and
 * must paint immediately. The wave field lives behind it (HeroCanvas).
 */
export function Hero({ content }: { content: HeroContent }) {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-void"
    >
      <HeroCanvas />

      <div className="shell relative z-10 flex flex-1 flex-col justify-end pb-20 pt-32 md:pb-28">
        <p className="t-mono mb-8 text-smoke">{content.eyebrow}</p>

        <h1 className="t-hero uppercase text-chalk">
          <span className="block">{content.line1}</span>
          <span className="block">{content.line2}</span>
          {/* The single accent word — the red used once, with intent. */}
          <span className="block text-blood">{content.accent}</span>
        </h1>

        <p className="mt-9 max-w-[48ch] text-lede text-smoke">{content.subline}</p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button href={APP_START} variant="primary">
            {content.primaryCta}
          </Button>
          <Button href="#mechanism" variant="ghostChalk">
            {content.secondaryCta}
          </Button>
        </div>
      </div>

      <span className="t-mono absolute bottom-7 right-[clamp(20px,5vw,80px)] z-10 text-smoke">
        {content.corner}
      </span>
    </section>
  );
}
