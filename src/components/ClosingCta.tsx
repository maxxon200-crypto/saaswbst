import { Button } from "./Button";
import { APP_START } from "@/lib/links";
import type { ClosingContent } from "@/content/types";

/**
 * Closing CTA — one heading, one button. Nothing else.
 */
export function ClosingCta({ content }: { content: ClosingContent }) {
  return (
    <section className="bg-bg py-28 md:py-[120px]">
      <div className="shell flex flex-col items-center text-center">
        <h2 data-reveal className="t-h2 max-w-[640px]">
          {content.heading}
        </h2>
        <div data-reveal className="mt-8">
          <Button href={APP_START}>{content.cta}</Button>
        </div>
      </div>
    </section>
  );
}
