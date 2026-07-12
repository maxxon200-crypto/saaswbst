"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextField, SelectField } from "@/components/ui/fields";
import { createProject } from "@/lib/data/actions";

const CURRENCIES = ["EUR", "GBP", "USD", "CHF"];

export function NewProjectDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await createProject({
      name: String(form.get("name") ?? ""),
      client_name: String(form.get("client_name") ?? ""),
      currency: String(form.get("currency") ?? "EUR"),
      markup: Number(form.get("markup") ?? 0),
    });
    if (res.ok) {
      setOpen(false);
      router.push(`/projects/${res.data.id}`);
    } else {
      setError(res.error);
      setBusy(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>New project</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="New project">
        <form onSubmit={onSubmit} className="space-y-4">
          <TextField name="name" label="Project name" required autoFocus placeholder="Palazzo Rézzonico" />
          <TextField name="client_name" label="Client" hint="Optional" placeholder="Client name" />
          <div className="grid grid-cols-2 gap-4">
            <SelectField name="currency" label="Currency" defaultValue="EUR">
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </SelectField>
            <TextField
              name="markup"
              label="Default markup %"
              type="number"
              min={0}
              step={1}
              defaultValue={0}
              data-numeric
            />
          </div>
          {error && <p className="text-[14px] text-negative">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Creating…" : "Create project"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
