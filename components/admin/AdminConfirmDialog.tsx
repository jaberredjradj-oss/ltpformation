"use client";

import { adminStyles } from "@/components/admin/admin-styles";

interface AdminConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  tone?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmer",
  tone = "default",
  onConfirm,
  onCancel,
}: AdminConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 px-4">
      <div className={`w-full max-w-md p-6 ${adminStyles.surface}`}>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className={adminStyles.btnSecondary}>
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={tone === "danger" ? adminStyles.btnDanger : adminStyles.btnPrimary}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
