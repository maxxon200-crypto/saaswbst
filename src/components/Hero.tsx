import Image from "next/image";
import { Button } from "./Button";
import { heroBlurDataURL } from "@/lib/heroBlur";
import type { HeroContent } from "@/content/types";

/**
 * Full-bleed hero.
 *
 * IMAGE NOTE: /public/images/hero.jpg is a neutral tonal PLACEHOLDER (not a
 * photograph, not AI-generated). Before launch, replace it with a licensed
 * Unsplash interior or a flat-lay of printed spec sheets, and give <Image> a
 * descriptive `alt`. remotePatterns for images.unsplash.com is already set up
 * in next.config if you prefer to point straight at a remote URL.
 *
 * The hero is intentionally NOT reveal-animated: it holds the LCP text and must
 * paint immediately.
 */
export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="relative flex min-h-[100svh] flex-col">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={heroBlurDataURL}
          className="object-cover"
        />
        {/* Dark veil for text legibility: rgba(28,28,26,0.45) */}
        <div className="absolute inset-0 bg-[var(--veil)]" />
      </div>

      <div className="shell relative flex flex-1 flex-col justify-end pb-16 pt-28 md:pb-24 md:pt-32">
        <h1 className="max-w-[16ch] text-balance font-medium text-display leading-display tracking-display text-paper">
          {content.headlinePre}
          {/* The single accent word. On the dark veil it uses the flagged
              lightened oxblood tint (--accent-tint) for contrast. */}
          <span className="text-accent-tint">{content.headlineAccent}</span>
          {content.headlinePost}
        </h1>

        <p className="mt-7 max-w-[46ch] text-lede text-paper">
          {content.subline}
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button href="#waitlist" variant="primary">
            {content.primaryCta}
          </Button>
          <Button href="#how-it-works" variant="outlineLight">
            {content.secondaryCta}
          </Button>
        </div>
      </div>
    </section>
  );
}
