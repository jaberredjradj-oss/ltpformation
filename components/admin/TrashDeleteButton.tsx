"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { TrashEntityType } from "@/lib/admin/types";
import { trashItem } from "@/lib/admin/trash-actions";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { useAdminToast } from "@/components/admin/AdminToast";

const CONFIRM_DESCRIPTION: Record<TrashEntityType, string> = {
  preinscription:
    "Cette pré-inscription sera déplacée dans la corbeille pendant 7 jours. Elle disparaîtra de toutes les vues admin, mais pourra être restaurée pendant cette période.",
  devis:
    "Ce devis sera déplacé dans la corbeille pendant 7 jours. Il disparaîtra de toutes les vues admin, mais pourra être restauré pendant cette période.",
  message:
    "Ce message sera déplacé dans la corbeille pendant 7 jours. Il disparaîtra de toutes les vues admin, mais pourra être restauré pendant cette période.",
};

interface TrashDeleteButtonProps {
  entityType: TrashEntityType;
  id: string;
  /** Nom affiché dans le titre de confirmation (apprenant, entreprise…). */
  label: string;
  disabled?: boolean;
}

/** Bouton « Supprimer » + confirmation — déplace un enregistrement vers la corbeille. */
export function TrashDeleteButton({ entityType, id, label, disabled }: TrashDeleteButtonProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [, startTransition] = useTransition();

  async function handleConfirm() {
    setDeleting(true);
    try {
      const result = await trashItem(entityType, id);
      if (!result.ok) {
        showToast(result.error, "error");
        return;
      }
      setOpen(false);
      showToast("Déplacé dans la corbeille (7 jours).");
      startTransition(() => router.refresh());
    } catch {
      showToast("Suppression impossible.", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <AdminActionButton
        label="Supprimer"
        tone="danger"
        disabled={disabled || deleting}
        onClick={() => setOpen(true)}
      />
      <AdminConfirmDialog
        open={open}
        title={`Supprimer ${label} ?`}
        description={CONFIRM_DESCRIPTION[entityType]}
        confirmLabel="Supprimer"
        tone="danger"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
