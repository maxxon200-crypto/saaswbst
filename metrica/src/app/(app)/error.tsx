"use client";

import { Button } from "@/components/ui/Button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="label">Something went wrong</p>
      <p className="mt-3 max-w-prose text-body text-stone">
        This screen failed to load. Try again, or return to your projects.
      </p>
      <div className="mt-5">
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
