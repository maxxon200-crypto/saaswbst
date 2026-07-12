// Quiet route-transition skeleton. Hairline placeholders only — no spinners.
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-56 bg-line" />
      <div className="mt-10 space-y-3 border-t border-line pt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-5 w-full bg-line" />
        ))}
      </div>
    </div>
  );
}
