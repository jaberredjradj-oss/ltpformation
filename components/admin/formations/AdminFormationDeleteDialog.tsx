"use client";

import type { FormationReferences } from "@/lib/admin/formations/delete-safety";
import { adminStyles } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";

interface AdminFormationDeleteDialogProps {
  open: boolean;
  formationTitle: string;
  references: FormationReferences | null;
  loading: boolean;
  pending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

function referenceReasons(references: FormationReferences): string[] {
  const reasons: string[] = [];
  if (references.isStatic) {
    reasons.push("elle fait partie du catalogue de base (définie dans le code)");
  }
  if (references.planningCount > 0) {
    reasons.push(
      `${references.planningCount} session(s) de planning y sont liées`,
    );
  }
  if (references.preinscriptionCount > 0) {
    reasons.push(
      `${references.preinscriptionCount} pré-inscription(s) y sont liées`,
    );
  }
  if (references.devisCount > 0) {
    reasons.push(`${references.devisCount} demande(s) de devis y sont liées`);
  }
  return reasons;
}

export function AdminFormationDeleteDialog({
  open,
  formationTitle,
  references,
  loading,
  pending,
  onConfirm,
  onClose,
}: AdminFormationDeleteDialogProps) {
  if (!open) return null;

  const canHardDelete = references?.canHardDelete ?? false;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 px-4">
      <div className={cn(adminStyles.surface, "w-full max-w-md p-6")}>
        <h2 className="text-lg font-semibold text-slate-900">
          {canHardDelete ? "Supprimer définitivement ?" : "Désactiver la formation ?"}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{formationTitle}</p>

        {loading || !references ? (
          <p className="mt-4 text-sm text-slate-500">Analyse des dépendances…</p>
        ) : canHardDelete ? (
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>
              Cette formation a été créée dans l&apos;administration et n&apos;a aucune dépendance
              (planning, pré-inscriptions, devis).
            </p>
            <p>
              <span className="font-medium text-slate-900">Suppression définitive</span> — action
              irréversible.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>
              Suppression définitive impossible car {referenceReasons(references).join(", ")}.
            </p>
            <p>
              Elle sera <span className="font-medium text-slate-900">désactivée</span> (masquée du
              site public) sans perte de données. Action réversible — vous pourrez la réactiver à
              tout moment.
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className={adminStyles.btnSecondary}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending || loading || !references}
            className={
              canHardDelete
                ? "inline-flex min-h-10 items-center justify-center rounded-md border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-700 transition-colors hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                : adminStyles.btnPrimary
            }
          >
            {pending
              ? "Traitement…"
              : canHardDelete
                ? "Supprimer définitivement"
                : "Désactiver"}
          </button>
        </div>
      </div>
    </div>
  );
}
