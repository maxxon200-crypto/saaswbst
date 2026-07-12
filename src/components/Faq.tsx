import type { FaqContent } from "@/content/types";

/**
 * FAQ — native <details>/<summary>. Accessible, zero JS, and fully open-able
 * with JS disabled. Hairline between items.
 */
export function Faq({ content }: { content: FaqContent }) {
  return (
    <section id="faq" className="bg-bg py-24 md:py-32">
      <div className="shell">
        <div data-reveal className="mx-auto max-w-[720px] text-center">
          <h2 className="t-h2">{content.heading}</h2>
          <p className="mt-4 text-[17px] text-text-dim">{content.subheading}</p>
        </div>

        <div data-reveal className="mx-auto mt-12 max-w-[760px] border-t border-hairline">
          {content.items.map((item) => (
            <details key={item.q} className="group border-b border-hairline">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[17px] font-medium text-text [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden className="mono shrink-0 text-[20px] leading-none text-text-mute">
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="max-w-[62ch] pb-5 text-[16px] text-text-dim">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
