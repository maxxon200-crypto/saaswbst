import { VideoFrame } from "./VideoFrame";

/**
 * The product video — directly under the hero. This is the section that sells
 * the product; everything else supports it. A single centred video, max-width
 * 1000px. Until the recording exists, VideoFrame shows an honest placeholder.
 */
// TODO: Max drops in /public/video/hero.mp4 — a 15–25s screen recording:
// drag a Flos PDF cut-sheet into the schedule → fields populate → export the spec book.
// Also drop /public/video/hero-poster.webp (first frame). No code change needed.
export function ProductVideo({ label }: { label: string }) {
  return (
    <section className="bg-bg">
      <div className="shell">
        <div data-reveal className="mx-auto max-w-video">
          <VideoFrame
            label={label}
            // src="/video/hero.mp4" poster="/video/hero-poster.webp"  ← uncomment when the file lands
          />
        </div>
      </div>
    </section>
  );
}
