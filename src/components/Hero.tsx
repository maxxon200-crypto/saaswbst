import { Button } from "./Button";
import { APP_START } from "@/lib/links";
import type { HeroContent } from "@/content/types";

/**
 * Hero — centred, compact, no background effect. Just type on charcoal, like
 * 10x. Holds the single <h1> and the LCP text, so it is NOT reveal-animated —
 * it paints immediately.
 */
export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="bg-bg">
      <div className="shell flex flex-col items-center pb-16 pt-28 text-center md:pb-[72px] md:pt-[140px]">
        <h1 className="t-hero max-w-[800px]">{content.headline}</h1>
        <p className="mt-5 max-w-[560px] text-[19px] leading-[1.5] text-text-dim">
          {content.subline}
        </p>
        <Button href={APP_START} className="mt-8">
          {content.cta}
        </Button>
        <p className="mt-4 text-[13px] text-text-mute">{content.ctaNote}</p>
      </div>
    </section>
  );
}
