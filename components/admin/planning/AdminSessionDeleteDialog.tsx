"use client";

import { useState } from "react";
import type { AdminPlanningRow } from "@/lib/admin/types";
import { adminStyles } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";

interface AdminSessionDeleteDialogProps {
  row: AdminPlanningRow | null;
  open: boolean;
  onClose: () => void;
  onArchive: (sessionId: string) => Promise<{ ok: boolean; error?: string }>;
  onDelete: (sessionId: string) => Promise<{ ok: boolean; error?: string }>;
}

export function AdminSessionDeleteDialog({
  row,
  open,
  onClose,
  onArchive,
  onDelete,
}: AdminSessionDeleteDialogProps) {
  const [pending, setPending] = useState<"archive" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open || !row) return null;

  async function run(
    kind: "archive" | "delete",
    action: (id: string) => Promise<{ ok: boolean; error?: string }>,
  ) {
    if (!row) return;
    setError(null);
    setPending(kind);
    try {
      const result = await action(row.id);
      if (result.ok) {
        onClose();
      } else {
        setError(result.error ?? "Action impossible.");
      }
    } catch {
      setError("Action impossible. Réessayez.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 px-4">
      <div className={cn(adminStyles.surface, "w-full max-w-md p-6")}>
        <h2 className="text-lg font-semibold text-slate-900">Supprimer ou archiver ?</h2>
        <p className="mt-1 text-sm text-slate-600">
          {row.formationTitle} — {row.dateLabel}
        </p>

        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <p>
            <span className="font-medium text-slate-900">Archiver</span> masque la session du
            site public sans perdre les données. C&apos;est l&apos;option recommandée et
            réversible.
          </p>
          <p>
            <span className="font-medium text-slate-900">Supprimer définitivement</span> retire
            la session de la base. Action irréversible et impossible si des inscriptions y sont
            liées.
          </p>
        </div>

        {error && (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            disabled={pending !== null}
            onClick={() => run("archive", onArchive)}
            className={adminStyles.btnPrimary}
          >
            {pending === "archive" ? "Archivage…" : "Archiver (recommandé)"}
          </button>
          <button
            type="button"
            disabled={pending !== null}
            onClick={() => run("delete", onDelete)}
            className="inline-flex h-9 items-center justify-center rounded-md border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-700 transition-colors hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending === "delete" ? "Suppression…" : "Supprimer définitivement"}
          </button>
          <button
            type="button"
            disabled={pending !== null}
            onClick={onClose}
            className={adminStyles.btnSecondary}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
