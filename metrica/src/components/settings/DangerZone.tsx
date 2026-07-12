"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { deleteAccount } from "@/lib/data/actions";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function DangerZone() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setBusy(true);
    setError(null);
    const res = await deleteAccount();
    if (res.ok) {
      try {
        await createSupabaseBrowserClient().auth.signOut();
      } catch {
        /* ignore */
      }
      router.push("/login");
    } else {
      setError(res.error);
      setBusy(false);
    }
  }

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete account
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Delete account">
        <p className="text-body text-stone">
          This permanently deletes your studio, every project and document, and
          your uploaded files. This cannot be undone.
        </p>
        {error && <p className="mt-3 text-[14px] text-negative">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirm} disabled={busy}>
            {busy ? "Deleting…" : "Delete everything"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
