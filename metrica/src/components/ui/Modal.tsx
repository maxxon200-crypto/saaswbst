"use client";

import { useEffect } from "react";

/**
 * Modal with a --ink 40% backdrop scrim (no drop shadow, per the design rules).
 * The panel is a --surface card with a 1px --line border.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-[12vh]">
      <div
        className="fixed inset-0 bg-[var(--scrim)]"
        aria-hidden
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="motion-panel relative w-full max-w-[460px] border border-line bg-surface p-7"
      >
        <h2 className="text-heading font-medium text-ink">{title}</h2>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
