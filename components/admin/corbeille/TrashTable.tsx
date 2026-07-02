"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminTrashedItem, TrashEntityType } from "@/lib/admin/types";
import { TRASH_ENTITY_LABELS } from "@/lib/admin/constants";
import { purgeItem, restoreItem } from "@/lib/admin/trash-actions";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { adminStyles } from "@/components/admin/admin-styles";
import { useAdminToast } from "@/components/admin/AdminToast";
import {
  AdminDataTable,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
} from "@/components/admin/AdminDataTable";

interface TrashTableProps {
  items: AdminTrashedItem[];
}

interface PurgeDialogState {
  entityType: TrashEntityType;
  id: string;
  label: string;
}

const TYPE_TONE: Record<TrashEntityType, "blue" | "gold" | "success"> = {
  preinscription: "blue",
  devis: "gold",
  message: "success",
};

function itemKey(item: AdminTrashedItem): string {
  return `${item.entityType}:${item.id}`;
}

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** Temps restant avant expiration de la corbeille (libellé + ton du badge). */
function remainingLabel(deleteExpiresAt: string): {
  label: string;
  tone: "gold" | "danger" | "neutral";
} {
  const remainingMs = new Date(deleteExpiresAt).getTime() - Date.now();
  if (remainingMs <= 0) {
    return { label: "Expiré — suppression définitive possible", tone: "neutral" };
  }
  const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  if (days >= 1) {
    return { label: `${days} j ${hours} h restants`, tone: days <= 2 ? "danger" : "gold" };
  }
  return { label: `${Math.max(hours, 1)} h restantes`, tone: "danger" };
}

export function TrashTable({ items }: TrashTableProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [pending, startTransition] = useTransition();
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [purgeDialog, setPurgeDialog] = useState<PurgeDialogState | null>(null);

  const actionsDisabled = pending || busyKey !== null;

  async function handleRestore(item: AdminTrashedItem) {
    setBusyKey(itemKey(item));
    try {
      const result = await restoreItem(item.entityType, item.id);
      if (!result.ok) {
        showToast(result.error, "error");
        return;
      }
      showToast("Élément restauré.");
      startTransition(() => router.refresh());
    } catch {
      showToast("Restauration impossible.", "error");
    } finally {
      setBusyKey(null);
    }
  }

  async function handleConfirmPurge() {
    if (!purgeDialog) return;

    setBusyKey(`${purgeDialog.entityType}:${purgeDialog.id}`);
    try {
      const result = await purgeItem(purgeDialog.entityType, purgeDialog.id);
      if (!result.ok) {
        showToast(result.error, "error");
        return;
      }
      setPurgeDialog(null);
      showToast("Supprimé définitivement.");
      startTransition(() => router.refresh());
    } catch {
      showToast("Suppression définitive impossible.", "error");
    } finally {
      setBusyKey(null);
    }
  }

  function renderActions(item: AdminTrashedItem) {
    return (
      <div className="flex flex-wrap gap-2">
        <AdminActionButton
          label="Restaurer"
          disabled={actionsDisabled}
          onClick={() => handleRestore(item)}
        />
        <AdminActionButton
          label="Supprimer définitivement"
          tone="danger"
          disabled={actionsDisabled}
          onClick={() =>
            setPurgeDialog({ entityType: item.entityType, id: item.id, label: item.primaryLabel })
          }
        />
      </div>
    );
  }

  function renderRow(item: AdminTrashedItem) {
    const remaining = remainingLabel(item.deleteExpiresAt);

    return (
      <AdminTableRow key={itemKey(item)}>
        <AdminTableCell>
          <AdminStatusBadge
            label={TRASH_ENTITY_LABELS[item.entityType]}
            tone={TYPE_TONE[item.entityType]}
          />
        </AdminTableCell>
        <AdminTableCell>
          <p className="font-semibold break-words text-navy-950">{item.primaryLabel}</p>
          {item.email && <p className="mt-1 break-words text-xs text-body-strong">{item.email}</p>}
          {item.secondaryLabel && (
            <p className="mt-0.5 break-words text-xs text-body-strong">{item.secondaryLabel}</p>
          )}
        </AdminTableCell>
        <AdminTableCell>
          <p className="whitespace-nowrap text-xs text-lead-strong">
            {formatDateTime(item.deletedAt)}
          </p>
        </AdminTableCell>
        <AdminTableCell>
          <AdminStatusBadge label={remaining.label} tone={remaining.tone} />
        </AdminTableCell>
        <AdminTableCell>{renderActions(item)}</AdminTableCell>
      </AdminTableRow>
    );
  }

  function renderMobileCard(item: AdminTrashedItem) {
    const remaining = remainingLabel(item.deleteExpiresAt);

    return (
      <div key={itemKey(item)} className={adminStyles.mobileCard}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <AdminStatusBadge
              label={TRASH_ENTITY_LABELS[item.entityType]}
              tone={TYPE_TONE[item.entityType]}
            />
            <p className="text-base font-semibold break-words text-navy-950">
              {item.primaryLabel}
            </p>
          </div>
          <AdminStatusBadge label={remaining.label} tone={remaining.tone} />
        </div>
        {item.email && (
          <p className="mt-2 break-words text-sm text-body-strong">{item.email}</p>
        )}
        {item.secondaryLabel && (
          <p className="mt-1 break-words text-sm text-body-strong">{item.secondaryLabel}</p>
        )}
        <p className="mt-2 text-xs text-lead-strong">
          Supprimé le {formatDateTime(item.deletedAt)}
        </p>
        <div className="mt-4 border-t border-slate-100 pt-4">{renderActions(item)}</div>
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Sécurité des données"
        title="Corbeille"
        description="Éléments supprimés (pré-inscriptions, devis, messages), conservés 7 jours avec leurs documents rattachés. Restaurez-les ou supprimez-les définitivement."
      />

      {items.length === 0 ? (
        <AdminEmptyState
          title="Corbeille vide"
          description="Les éléments supprimés apparaîtront ici pendant 7 jours avant suppression définitive."
        />
      ) : (
        <>
          <div className="space-y-3 md:hidden">{items.map(renderMobileCard)}</div>

          <AdminDataTable className="hidden md:block">
            <AdminTable>
              <AdminTableHead>
                <tr>
                  <AdminTableHeaderCell>Type</AdminTableHeaderCell>
                  <AdminTableHeaderCell>Élément</AdminTableHeaderCell>
                  <AdminTableHeaderCell>Supprimé le</AdminTableHeaderCell>
                  <AdminTableHeaderCell>Temps restant</AdminTableHeaderCell>
                  <AdminTableHeaderCell className="text-blue-600">Actions</AdminTableHeaderCell>
                </tr>
              </AdminTableHead>
              <AdminTableBody>{items.map(renderRow)}</AdminTableBody>
            </AdminTable>
          </AdminDataTable>
        </>
      )}

      <AdminConfirmDialog
        open={purgeDialog !== null}
        title={`Supprimer définitivement ${purgeDialog?.label ?? "cet élément"} ?`}
        description="Cette action est irréversible : l'élément et ses documents rattachés seront définitivement supprimés."
        confirmLabel="Supprimer définitivement"
        tone="danger"
        onConfirm={handleConfirmPurge}
        onCancel={() => setPurgeDialog(null)}
      />
    </>
  );
}
