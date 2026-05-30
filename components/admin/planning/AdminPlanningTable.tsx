"use client";

import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState, useTransition } from "react";
import type {
  AdminEditableSession,
  AdminFormationOption,
  AdminPlanningRow,
  AdminSessionInput,
} from "@/lib/admin/types";
import {
  archiveSession,
  deleteSession,
  markSessionFull,
  saveSession,
  toggleSessionVisibility,
} from "@/lib/admin/actions";
import {
  DEFAULT_PLANNING_QUERY,
  getPlanningFilterOptions,
  queryPlanningRows,
} from "@/lib/admin/list-controls/planning";
import { PLANNING_GROUP_OPTIONS, toSelectOptions } from "@/lib/admin/list-controls/helpers";
import type { PlanningListQuery } from "@/lib/admin/list-controls/types";
import { formatMonthLabel, getQueryResultCount } from "@/lib/admin/list-controls/utils";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { AdminFilterSelect } from "@/components/admin/AdminFilterSelect";
import { AdminGroupSelect } from "@/components/admin/AdminGroupSelect";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminResultsSummary } from "@/components/admin/AdminResultsSummary";
import { AdminSearchInput } from "@/components/admin/AdminSearchInput";
import { AdminSortSelect } from "@/components/admin/AdminSortSelect";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminTableGroupHeader } from "@/components/admin/AdminTableGroupHeader";
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
import { AdminSessionEditorDialog } from "@/components/admin/planning/AdminSessionEditorDialog";
import { AdminSessionDeleteDialog } from "@/components/admin/planning/AdminSessionDeleteDialog";
import { adminStyles } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";

interface AdminPlanningTableProps {
  rows: AdminPlanningRow[];
  editableSessions: AdminEditableSession[];
  formations: AdminFormationOption[];
}

const VISIBILITY_OPTIONS = [
  { value: "all", label: "Tous" },
  { value: "visible", label: "Visible" },
  { value: "hidden", label: "Masquée" },
];

function availabilityTone(label: string) {
  if (label === "Complet") return "danger" as const;
  if (label === "Dernières places") return "warning" as const;
  return "success" as const;
}

export function AdminPlanningTable({
  rows,
  editableSessions,
  formations,
}: AdminPlanningTableProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [pending, startTransition] = useTransition();
  const [confirmFull, setConfirmFull] = useState<AdminPlanningRow | null>(null);
  const [deleteRow, setDeleteRow] = useState<AdminPlanningRow | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editSession, setEditSession] = useState<AdminEditableSession | null>(null);
  const [query, setQuery] = useState(DEFAULT_PLANNING_QUERY);

  const sessionsById = useMemo(
    () => new Map(editableSessions.map((session) => [session.id, session])),
    [editableSessions],
  );

  const filterOptions = useMemo(() => getPlanningFilterOptions(rows), [rows]);
  const queryResult = useMemo(() => queryPlanningRows(rows, query), [rows, query]);
  const resultCount = getQueryResultCount(queryResult);

  const monthOptions = useMemo(
    () =>
      filterOptions.months.map((value) => ({
        value,
        label: value === "all" ? "Tous" : formatMonthLabel(value),
      })),
    [filterOptions.months],
  );

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function handleToggleVisibility(row: AdminPlanningRow) {
    try {
      await toggleSessionVisibility(row.id, !row.visible);
      showToast(row.visible ? "Session masquée." : "Session visible.");
      refresh();
    } catch {
      showToast("Action impossible.", "error");
    }
  }

  async function handleMarkFull() {
    if (!confirmFull) return;
    try {
      await markSessionFull(confirmFull.id);
      showToast("Session marquée comme complète.");
      setConfirmFull(null);
      refresh();
    } catch {
      showToast("Action impossible.", "error");
    }
  }

  function handleCreate() {
    setEditSession(null);
    setEditorOpen(true);
  }

  function handleEdit(row: AdminPlanningRow) {
    setEditSession(sessionsById.get(row.id) ?? null);
    setEditorOpen(true);
  }

  async function handleSaveSession(input: AdminSessionInput) {
    const result = await saveSession(input);
    if (result.ok) {
      showToast(input.id ? "Session mise à jour." : "Session créée.");
      refresh();
    }
    return result;
  }

  async function handleArchive(sessionId: string) {
    const result = await archiveSession(sessionId);
    if (result.ok) {
      showToast("Session archivée.");
      refresh();
    }
    return result;
  }

  async function handleDelete(sessionId: string) {
    const result = await deleteSession(sessionId);
    if (result.ok) {
      showToast("Session supprimée.");
      refresh();
    }
    return result;
  }

  function renderRow(row: AdminPlanningRow) {
    return (
      <AdminTableRow key={row.id}>
        <AdminTableCell>
          <p className="max-w-xs font-medium text-navy-950">{row.formationTitle}</p>
          <p className="mt-1 text-xs text-lead-strong">{row.id}</p>
        </AdminTableCell>
        <AdminTableCell className="whitespace-nowrap">{row.dateLabel}</AdminTableCell>
        <AdminTableCell>{row.durationLabel}</AdminTableCell>
        <AdminTableCell>
          <p className="max-w-[220px] text-xs leading-relaxed">{row.location}</p>
        </AdminTableCell>
        <AdminTableCell>
          {row.seatsTotal !== null ? (
            <div className="tabular-nums">
              <p className="font-medium text-navy-950">
                {row.seatsTaken ?? 0}/{row.seatsTotal}
              </p>
              {row.seatsRemaining !== null && (
                <p className="text-xs text-body-strong">{row.seatsRemaining} restantes</p>
              )}
            </div>
          ) : (
            <span className="text-xs text-lead-strong">Non renseigné</span>
          )}
        </AdminTableCell>
        <AdminTableCell>
          <AdminStatusBadge
            label={row.availabilityLabel}
            tone={availabilityTone(row.availabilityLabel)}
          />
        </AdminTableCell>
        <AdminTableCell>
          <AdminStatusBadge
            label={row.visible ? "Visible" : "Masquée"}
            tone={row.visible ? "blue" : "neutral"}
          />
        </AdminTableCell>
        <AdminTableCell>
          <div className="flex flex-wrap gap-2">
            <AdminActionButton label="Modifier" onClick={() => handleEdit(row)} />
            <AdminActionButton
              label={row.visible ? "Masquer" : "Afficher"}
              onClick={() => handleToggleVisibility(row)}
            />
            <AdminActionButton label="Complet" onClick={() => setConfirmFull(row)} />
            <AdminActionButton label="Supprimer" onClick={() => setDeleteRow(row)} />
          </div>
        </AdminTableCell>
      </AdminTableRow>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader
          eyebrow="Planning"
          title="Sessions de formation"
          description="Gestion des sessions publiées sur le site. Les modifications sont visibles sur le planning public."
        />
        <button type="button" onClick={handleCreate} className={cn(adminStyles.btnPrimary, "shrink-0")}>
          Créer une session
        </button>
      </div>

      {rows.length === 0 ? (
        <AdminEmptyState
          title="Aucune session"
          description="Créez votre première session avec le bouton « Créer une session »."
        />
      ) : (
        <>
          <AdminFilterBar
            onReset={() => setQuery(DEFAULT_PLANNING_QUERY)}
            summary={<AdminResultsSummary count={resultCount} total={rows.length} />}
          >
            <AdminSearchInput
              value={query.search}
              onChange={(search) => setQuery((current) => ({ ...current, search }))}
              placeholder="Formation, lieu, dates…"
            />
            <AdminFilterSelect
              label="Catégorie"
              value={query.category}
              options={toSelectOptions(filterOptions.categories)}
              onChange={(category) => setQuery((current) => ({ ...current, category }))}
            />
            <AdminFilterSelect
              label="Formation"
              value={query.formation}
              options={toSelectOptions(filterOptions.formations)}
              onChange={(formation) => setQuery((current) => ({ ...current, formation }))}
            />
            <AdminFilterSelect
              label="Statut"
              value={query.availability}
              options={toSelectOptions(filterOptions.availability)}
              onChange={(availability) => setQuery((current) => ({ ...current, availability }))}
            />
            <AdminFilterSelect
              label="Visibilité"
              value={query.visibility}
              options={VISIBILITY_OPTIONS}
              onChange={(visibility) =>
                setQuery((current) => ({
                  ...current,
                  visibility: visibility as PlanningListQuery["visibility"],
                }))
              }
            />
            <AdminFilterSelect
              label="Mois"
              value={query.month}
              options={monthOptions}
              onChange={(month) => setQuery((current) => ({ ...current, month }))}
            />
            <AdminSortSelect
              value={query.sort}
              onChange={(sort) => setQuery((current) => ({ ...current, sort }))}
            />
            <AdminGroupSelect
              value={query.group}
              options={PLANNING_GROUP_OPTIONS}
              onChange={(group) => setQuery((current) => ({ ...current, group }))}
            />
          </AdminFilterBar>

          {resultCount === 0 ? (
            <AdminEmptyState
              title="Aucun résultat"
              description="Aucune session ne correspond à vos filtres."
            />
          ) : (
            <AdminDataTable>
              <AdminTable>
                <AdminTableHead>
                  <tr>
                    <AdminTableHeaderCell>Formation</AdminTableHeaderCell>
                    <AdminTableHeaderCell>Dates</AdminTableHeaderCell>
                    <AdminTableHeaderCell>Durée</AdminTableHeaderCell>
                    <AdminTableHeaderCell>Lieu</AdminTableHeaderCell>
                    <AdminTableHeaderCell>Places</AdminTableHeaderCell>
                    <AdminTableHeaderCell>Statut</AdminTableHeaderCell>
                    <AdminTableHeaderCell>Visible</AdminTableHeaderCell>
                    <AdminTableHeaderCell>Actions</AdminTableHeaderCell>
                  </tr>
                </AdminTableHead>
                <AdminTableBody>
                  {queryResult.mode === "flat" ? (
                    queryResult.items.map(renderRow)
                  ) : (
                    queryResult.groups.map((group) => (
                      <Fragment key={group.label}>
                        <AdminTableGroupHeader label={group.label} count={group.items.length} />
                        {group.items.map(renderRow)}
                      </Fragment>
                    ))
                  )}
                </AdminTableBody>
              </AdminTable>
            </AdminDataTable>
          )}
        </>
      )}

      <AdminConfirmDialog
        open={confirmFull !== null}
        title="Marquer la session comme complète ?"
        description={
          confirmFull ? `${confirmFull.formationTitle} — ${confirmFull.dateLabel}` : ""
        }
        confirmLabel="Marquer complet"
        onConfirm={handleMarkFull}
        onCancel={() => setConfirmFull(null)}
      />

      <AdminSessionEditorDialog
        open={editorOpen}
        session={editSession}
        formations={formations}
        onClose={() => setEditorOpen(false)}
        onSave={handleSaveSession}
      />

      <AdminSessionDeleteDialog
        row={deleteRow}
        open={deleteRow !== null}
        onClose={() => setDeleteRow(null)}
        onArchive={handleArchive}
        onDelete={handleDelete}
      />

      {pending && <p className="mt-3 text-xs text-body-strong">Actualisation…</p>}
    </>
  );
}
