import { cn } from "@/lib/cn";
import { VideoFrame } from "./VideoFrame";
import type { FeaturesContent } from "@/content/types";

/**
 * Features — three panels, each with its own product video (same swappable
 * VideoFrame as the hero). Text and video alternate sides on desktop; on mobile
 * they stack, text first.
 */
// Video slots — drop these files in and pass them to the matching VideoFrame;
// no other change is needed.
// TODO: /public/video/feature-extract.mp4
// TODO: /public/video/feature-library.mp4
// TODO: /public/video/feature-specbook.mp4
const FEATURE_VIDEOS = [
  "/video/feature-extract.mp4",
  "/video/feature-library.mp4",
  "/video/feature-specbook.mp4",
];

export function Features({
  content,
  videoLabel,
}: {
  content: FeaturesContent;
  videoLabel: string;
}) {
  return (
    <section id="features" className="bg-bg py-24 md:py-32">
      <div className="shell">
        <div data-reveal className="mx-auto max-w-[720px] text-center">
          <h2 className="t-h2">{content.heading}</h2>
          <p className="mt-4 text-[17px] text-text-dim">{content.subheading}</p>
        </div>

        <div className="mt-14 flex flex-col gap-6 md:mt-16">
          {content.items.map((item, i) => (
            <div
              key={item.title}
              data-reveal
              className="grid gap-8 rounded-xl border border-hairline bg-surface p-6 md:grid-cols-2 md:items-center md:gap-12 md:p-10"
            >
              <div className={cn(i % 2 === 1 && "md:order-2")}>
                <h3 className="t-feature">{item.title}</h3>
                <p className="mt-3 max-w-[44ch] text-[16px] text-text-dim">{item.body}</p>
              </div>
              {/* data-video-src marks the file to drop in; pass it to VideoFrame's
                  src (and add a poster) when the recording lands. */}
              <div className={cn(i % 2 === 1 && "md:order-1")} data-video-src={FEATURE_VIDEOS[i]}>
                <VideoFrame label={videoLabel} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
