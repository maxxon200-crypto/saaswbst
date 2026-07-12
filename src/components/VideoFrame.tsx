import { cn } from "@/lib/cn";

/**
 * A swappable product-video slot. Server component — the <video> autoplays via
 * attributes, so no client JS.
 *
 * Until a real screen recording exists, `src` is omitted and we render an honest
 * static placeholder ("Preview coming"). Dropping the file in is a one-line
 * change at the call site: pass `src` and `poster`. Do NOT fake the product with
 * animated HTML — a placeholder waiting for a real video is the honest choice.
 */
export function VideoFrame({
  src,
  poster,
  label,
  className,
}: {
  src?: string;
  poster?: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-xl border border-hairline bg-surface",
        className,
      )}
    >
      {src ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          className="h-full w-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0 grid place-content-center justify-items-center gap-4 text-center">
          <span
            aria-hidden
            className="grid h-12 w-12 place-content-center rounded-full border border-hairline"
          >
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden>
              <path d="M1 1.5v13l12-6.5L1 1.5Z" fill="var(--text-mute)" />
            </svg>
          </span>
          <span className="t-label">{label}</span>
        </div>
      )}
    </div>
  );
}
