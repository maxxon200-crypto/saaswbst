import type { ManifestoContent } from "@/content/types";

/**
 * Manifesto — --void, full bleed, five lines at display weight and scale, one
 * word in blood. Generous breaks. The accent word is wrapped once.
 */
export function Manifesto({ content }: { content: ManifestoContent }) {
  let accentUsed = false;
  const renderLine = (line: string) => {
    const idx = accentUsed ? -1 : line.indexOf(content.accent);
    if (idx === -1) return line;
    accentUsed = true;
    return (
      <>
        {line.slice(0, idx)}
        <span className="text-blood">{content.accent}</span>
        {line.slice(idx + content.accent.length)}
      </>
    );
  };

  return (
    <section id="manifesto" className="bg-void text-chalk">
      <div className="shell py-28 md:py-44">
        <p data-reveal className="t-mono mb-12 text-smoke">
          {content.label}
        </p>
        <div data-reveal className="space-y-1.5 md:space-y-2.5">
          {content.lines.map((line, i) => (
            <p
              key={i}
              className="text-[clamp(30px,5.4vw,80px)] font-black uppercase leading-[1.02] tracking-[-0.035em]"
            >
              {renderLine(line)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
