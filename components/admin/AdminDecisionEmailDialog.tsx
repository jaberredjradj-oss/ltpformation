"use client";

import { AdminBrandedEmailPreview } from "@/components/admin/AdminBrandedEmailPreview";
import { adminStyles } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";

interface AdminDecisionEmailDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  submitLabel?: string;
  recipient: string;
  recipientLabel?: string;
  contextLabel?: string;
  contextContent?: string;
  subject: string;
  message: string;
  sending?: boolean;
  onSubjectChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  onCancel: () => void;
}

export function AdminDecisionEmailDialog({
  open,
  title = "Envoyer un email au candidat",
  description = "Le statut ne sera enregistré qu'après envoi ou confirmation.",
  submitLabel = "Envoyer l'email",
  recipient,
  recipientLabel,
  contextLabel,
  contextContent,
  subject,
  message,
  sending = false,
  onSubjectChange,
  onMessageChange,
  onSend,
  onCancel,
}: AdminDecisionEmailDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-900/40 px-4 py-6">
      <div
        className={cn(
          adminStyles.surface,
          "flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden",
        )}
      >
        <div className={cn(adminStyles.sectionHeader, "border-b")}>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <div className="mb-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className={adminStyles.label}>Destinataire</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{recipient}</p>
              {recipientLabel && (
                <p className="mt-0.5 text-xs text-slate-500">{recipientLabel}</p>
              )}
            </div>
          </div>

          {contextContent && (
            <div className="mb-5">
              <p className={adminStyles.label}>{contextLabel ?? "Message reçu"}</p>
              <div
                className={cn(
                  adminStyles.surfaceMuted,
                  "mt-2 max-h-32 overflow-y-auto px-4 py-3 text-sm leading-relaxed text-slate-700",
                )}
              >
                {contextContent}
              </div>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <div className="space-y-4">
              <label className="block text-sm">
                <span className="font-medium text-slate-900">Objet</span>
                <input
                  type="text"
                  value={subject}
                  onChange={(event) => onSubjectChange(event.target.value)}
                  className={cn(adminStyles.input, "mt-1.5 px-3.5 py-2.5")}
                />
              </label>

              <label className="block text-sm">
                <span className="font-medium text-slate-900">Message (texte brut)</span>
                <span className="mt-0.5 block text-xs font-normal text-slate-500">
                  Modifiez le contenu ici — l&apos;aperçu se met à jour automatiquement.
                </span>
                <textarea
                  value={message}
                  onChange={(event) => onMessageChange(event.target.value)}
                  rows={14}
                  className={cn(adminStyles.input, "mt-1.5 resize-y px-3.5 py-3 font-mono text-[13px] leading-relaxed")}
                />
              </label>
            </div>

            <AdminBrandedEmailPreview
              subject={subject}
              message={message}
              className="lg:sticky lg:top-0"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={sending}
            className={adminStyles.btnSecondary}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onSend}
            disabled={sending}
            className={adminStyles.btnPrimary}
          >
            {sending ? "Envoi…" : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
