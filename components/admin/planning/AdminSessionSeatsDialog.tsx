"use client";

import { useState } from "react";
import type { AdminPlanningRow } from "@/lib/admin/types";
import { adminStyles } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";

interface AdminSessionSeatsDialogProps {
  row: AdminPlanningRow | null;
  open: boolean;
  onClose: () => void;
  onSave: (sessionId: string, seatsTotal: number | null, seatsTaken: number | null) => Promise<void>;
}

function AdminSessionSeatsForm({
  row,
  onClose,
  onSave,
}: {
  row: AdminPlanningRow;
  onClose: () => void;
  onSave: AdminSessionSeatsDialogProps["onSave"];
}) {
  const [seatsTotal, setSeatsTotal] = useState(row.seatsTotal?.toString() ?? "");
  const [seatsTaken, setSeatsTaken] = useState(row.seatsTaken?.toString() ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const total = seatsTotal.trim() ? Number(seatsTotal) : null;
      const taken = seatsTaken.trim() ? Number(seatsTaken) : null;
      await onSave(row.id, total, taken);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn(adminStyles.surface, "w-full max-w-md p-6")}>
      <h2 className="text-lg font-semibold text-slate-900">Modifier les places</h2>
      <p className="mt-1 text-sm text-slate-600">{row.formationTitle}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-slate-900">Places totales</span>
          <input
            type="number"
            min={0}
            value={seatsTotal}
            onChange={(event) => setSeatsTotal(event.target.value)}
            className={cn(adminStyles.input, "mt-1.5 px-3 py-2")}
            placeholder="Ex. 12"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-900">Places prises</span>
          <input
            type="number"
            min={0}
            value={seatsTaken}
            onChange={(event) => setSeatsTaken(event.target.value)}
            className={cn(adminStyles.input, "mt-1.5 px-3 py-2")}
            placeholder="Ex. 8"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onClose} className={adminStyles.btnSecondary}>
          Annuler
        </button>
        <button type="submit" disabled={saving} className={adminStyles.btnPrimary}>
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

export function AdminSessionSeatsDialog({
  row,
  open,
  onClose,
  onSave,
}: AdminSessionSeatsDialogProps) {
  if (!open || !row) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 px-4">
      <AdminSessionSeatsForm key={row.id} row={row} onClose={onClose} onSave={onSave} />
    </div>
  );
}
