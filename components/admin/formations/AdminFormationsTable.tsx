"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AdminFormationRow } from "@/lib/admin/formations/types";
import {
  deleteFormation,
  duplicateFormation,
  loadFormationReferences,
  setFormationActive,
} from "@/lib/admin/formations/actions";
import type { FormationReferences } from "@/lib/admin/formations/delete-safety";
import { FORMATION_CATEGORIES } from "@/lib/formations/categories";
import type { FormationSource } from "@/lib/repositories/formations/types";
import { adminStyles } from "@/components/admin/admin-styles";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminFilterSelect } from "@/components/admin/AdminFilterSelect";
import { AdminFormationDeleteDialog } from "@/components/admin/formations/AdminFormationDeleteDialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSearchInput } from "@/components/admin/AdminSearchInput";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { useAdminToast } from "@/components/admin/AdminToast";
import {
  AdminDataTable,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableRow,
} from "@/components/admin/AdminDataTable";

interface AdminFormationsTableProps {
  rows: AdminFormationRow[];
}

const SOURCE_LABELS: Record<FormationSource, string> = {
  static: "Catalogue",
  admin: "Créée",
  "static-override": "Personnalisée",
};

function sourceTone(source: FormationSource) {
  if (source === "admin") return "blue" as const;
  if (source === "static-override") return "gold" as const;
  return "neutral" as const;
}

const CATEGORY_OPTIONS = [
  { value: "all", label: "Toutes les catégories" },
  ...FORMATION_CATEGORIES.map((category) => ({
    value: category.id,
    label: category.label,
  })),
];

const STATUS_OPTIONS = [
  { value: "all", label: "Tous les statuts" },
  { value: "active", label: "Actives" },
  { value: "inactive", label: "Désactivées" },
];

interface DeleteDialogState {
  row: AdminFormationRow;
  references: FormationReferences | null;
  loading: boolean;
}

export function AdminFormationsTable({ rows }: AdminFormationsTableProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [pending, startTransition] = useTransition();
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [deleteState, setDeleteState] = useState<DeleteDialogState | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const actionsDisabled = pending || busySlug !== null;

  async function handleDuplicate(row: AdminFormationRow) {
    setBusySlug(row.slug);
    try {
      const result = await duplicateFormation(row.slug);
      if (!result.ok) {
        showToast(result.error ?? "Duplication impossible.", "error");
        return;
      }
      showToast("Formation dupliquée (désactivée).");
      startTransition(() => router.refresh());
    } catch {
      showToast("Duplication impossible.", "error");
    } finally {
      setBusySlug(null);
    }
  }

  async function handleToggleActive(row: AdminFormationRow) {
    setBusySlug(row.slug);
    try {
      const result = await setFormationActive(row.slug, !row.active);
      if (!result.ok) {
        showToast(result.error ?? "Mise à jour impossible.", "error");
        return;
      }
      showToast(row.active ? "Formation désactivée." : "Formation activée.");
      startTransition(() => router.refresh());
    } catch {
      showToast("Mise à jour impossible.", "error");
    } finally {
      setBusySlug(null);
    }
  }

  async function openDeleteDialog(row: AdminFormationRow) {
    setDeleteState({ row, references: null, loading: true });
    try {
      const references = await loadFormationReferences(row.slug);
      setDeleteState((current) =>
        current && current.row.slug === row.slug
          ? { ...current, references, loading: false }
          : current,
      );
    } catch {
      setDeleteState((current) =>
        current && current.row.slug === row.slug
          ? { ...current, loading: false }
          : current,
      );
      showToast("Analyse des dépendances impossible.", "error");
    }
  }

  async function confirmDelete() {
    if (!deleteState) return;
    const slug = deleteState.row.slug;
    setBusySlug(slug);
    try {
      const result = await deleteFormation(slug);
      if (!result.ok) {
        showToast(result.error ?? "Suppression impossible.", "error");
        return;
      }
      showToast(
        result.mode === "deleted"
          ? "Formation supprimée définitivement."
          : "Formation désactivée (masquée du site).",
      );
      setDeleteState(null);
      startTransition(() => router.refresh());
    } catch {
      showToast("Suppression impossible.", "error");
    } finally {
      setBusySlug(null);
    }
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (category !== "all" && row.category !== category) return false;
      if (status === "active" && !row.active) return false;
      if (status === "inactive" && row.active) return false;
      if (!query) return true;
      return (
        row.title.toLowerCase().includes(query) ||
        row.slug.toLowerCase().includes(query) ||
        row.categoryLabel.toLowerCase().includes(query)
      );
    });
  }, [rows, search, category, status]);

  const activeCount = useMemo(() => rows.filter((row) => row.active).length, [rows]);

  function renderStatus(row: AdminFormationRow) {
    return (
      <AdminStatusBadge
        label={row.active ? "Active" : "Désactivée"}
        tone={row.active ? "success" : "neutral"}
        className="whitespace-nowrap"
      />
    );
  }

  function renderActions(row: AdminFormationRow) {
    const busy = busySlug === row.slug;
    return (
      <div className="flex flex-wrap gap-2">
        <Link href={`/admin/formations/${row.slug}/edit`} className={adminStyles.btnSecondary}>
          Éditer
        </Link>
        <button
          type="button"
          className={adminStyles.btnSecondary}
          disabled={actionsDisabled}
          onClick={() => handleDuplicate(row)}
        >
          {busy ? "…" : "Dupliquer"}
        </button>
        <button
          type="button"
          className={adminStyles.btnSecondary}
          disabled={actionsDisabled}
          onClick={() => handleToggleActive(row)}
        >
          {row.active ? "Désactiver" : "Activer"}
        </button>
        <button
          type="button"
          className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-md border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 transition-colors hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-8"
          disabled={actionsDisabled}
          onClick={() => openDeleteDialog(row)}
        >
          Supprimer
        </button>
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Formations"
        description={`${rows.length} formations au catalogue • ${activeCount} actives. Recherchez et filtrez le catalogue.`}
      />

      <div className="mb-5 flex justify-end">
        <Link href="/admin/formations/new" className={adminStyles.btnPrimary}>
          + Nouvelle formation
        </Link>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <label className="block min-w-0">
          <span className={`mb-1.5 block ${adminStyles.label}`}>Recherche</span>
          <AdminSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Titre, slug, catégorie…"
          />
        </label>
        <AdminFilterSelect
          label="Catégorie"
          value={category}
          options={CATEGORY_OPTIONS}
          onChange={setCategory}
        />
        <AdminFilterSelect
          label="Statut"
          value={status}
          options={STATUS_OPTIONS}
          onChange={setStatus}
        />
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState
          title="Aucune formation"
          description="Aucune formation ne correspond à votre recherche."
        />
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {filtered.map((row) => (
              <div key={row.slug} className={adminStyles.mobileCard}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <Link
                    href={`/admin/formations/${row.slug}/edit`}
                    className="text-base font-semibold break-words text-navy-950 hover:text-blue-600"
                  >
                    {row.title}
                  </Link>
                  {renderStatus(row)}
                </div>
                <p className="mt-1 break-all text-xs text-slate-500">{row.slug}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <AdminStatusBadge label={row.categoryLabel} tone="blue" />
                  <AdminStatusBadge label={row.typeLabel} className="whitespace-nowrap" />
                  <AdminStatusBadge
                    label={SOURCE_LABELS[row.source]}
                    tone={sourceTone(row.source)}
                    className="whitespace-nowrap"
                  />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-1 text-sm text-body-strong">
                  <p>{row.durationLabel}</p>
                  <p>{row.priceLabel}</p>
                  <p>CPF : {row.cpfEligible ? "Oui" : "Non"}</p>
                </div>
                <div className="mt-4 border-t border-slate-100 pt-3">
                  {renderActions(row)}
                </div>
              </div>
            ))}
          </div>

          <AdminDataTable className="hidden md:block">
            <AdminTable>
              <AdminTableHead>
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-blue-600">Formation</th>
                  <th className="px-4 py-3 text-left font-medium text-blue-600">Catégorie</th>
                  <th className="px-4 py-3 text-left font-medium text-blue-600">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-blue-600">Durée</th>
                  <th className="px-4 py-3 text-left font-medium text-blue-600">Tarif</th>
                  <th className="px-4 py-3 text-left font-medium text-blue-600">CPF</th>
                  <th className="px-4 py-3 text-left font-medium text-blue-600">Source</th>
                  <th className="px-4 py-3 text-left font-medium text-blue-600">Statut</th>
                  <th className="px-4 py-3 text-left font-medium text-blue-600">Actions</th>
                </tr>
              </AdminTableHead>
              <AdminTableBody>
                {filtered.map((row) => (
                  <AdminTableRow key={row.slug}>
                    <AdminTableCell>
                      <Link
                        href={`/admin/formations/${row.slug}/edit`}
                        className="font-semibold break-words text-navy-950 hover:text-blue-600"
                      >
                        {row.title}
                      </Link>
                      <p className="mt-0.5 break-all text-xs text-slate-500">{row.slug}</p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <p className="break-words text-sm">{row.categoryLabel}</p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <p className="text-sm">{row.typeLabel}</p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <p className="whitespace-nowrap text-sm">{row.durationLabel}</p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <p className="break-words text-sm">{row.priceLabel}</p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <p className="text-sm">{row.cpfEligible ? "Oui" : "Non"}</p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <AdminStatusBadge
                        label={SOURCE_LABELS[row.source]}
                        tone={sourceTone(row.source)}
                        className="whitespace-nowrap"
                      />
                    </AdminTableCell>
                    <AdminTableCell>{renderStatus(row)}</AdminTableCell>
                    <AdminTableCell>{renderActions(row)}</AdminTableCell>
                  </AdminTableRow>
                ))}
              </AdminTableBody>
            </AdminTable>
          </AdminDataTable>
        </>
      )}

      <AdminFormationDeleteDialog
        open={deleteState !== null}
        formationTitle={deleteState?.row.title ?? ""}
        references={deleteState?.references ?? null}
        loading={deleteState?.loading ?? false}
        pending={busySlug !== null && busySlug === deleteState?.row.slug}
        onConfirm={confirmDelete}
        onClose={() => {
          if (busySlug) return;
          setDeleteState(null);
        }}
      />
    </>
  );
}
