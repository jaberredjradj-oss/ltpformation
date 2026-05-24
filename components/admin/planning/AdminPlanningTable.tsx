"use client";

import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState, useTransition } from "react";
import type { AdminPlanningRow } from "@/lib/admin/types";
import {
  markSessionFull,
  toggleSessionVisibility,
  updateSessionSeats,
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
import { AdminSessionSeatsDialog } from "@/components/admin/planning/AdminSessionSeatsDialog";

interface AdminPlanningTableProps {
  rows: AdminPlanningRow[];
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

export function AdminPlanningTable({ rows }: AdminPlanningTableProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [pending, startTransition] = useTransition();
  const [confirmFull, setConfirmFull] = useState<AdminPlanningRow | null>(null);
  const [editRow, setEditRow] = useState<AdminPlanningRow | null>(null);
  const [query, setQuery] = useState(DEFAULT_PLANNING_QUERY);

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

  async function handleSaveSeats(
    sessionId: string,
    seatsTotal: number | null,
    seatsTaken: number | null,
  ) {
    try {
      await updateSessionSeats(sessionId, seatsTotal, seatsTaken);
      showToast("Places mises à jour.");
      refresh();
    } catch {
      showToast("Enregistrement impossible.", "error");
    }
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
            <AdminActionButton label="Modifier" onClick={() => setEditRow(row)} />
            <AdminActionButton
              label={row.visible ? "Masquer" : "Afficher"}
              onClick={() => handleToggleVisibility(row)}
            />
            <AdminActionButton label="Complet" onClick={() => setConfirmFull(row)} />
          </div>
        </AdminTableCell>
      </AdminTableRow>
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Planning"
        title="Sessions de formation"
        description="Gestion des sessions publiées sur le site. Les modifications sont visibles sur le planning public."
      />

      {rows.length === 0 ? (
        <AdminEmptyState
          title="Aucune session"
          description="Les sessions apparaîtront ici une fois le planning alimenté."
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

      <AdminSessionSeatsDialog
        row={editRow}
        open={editRow !== null}
        onClose={() => setEditRow(null)}
        onSave={handleSaveSeats}
      />

      {pending && <p className="mt-3 text-xs text-body-strong">Actualisation…</p>}
    </>
  );
}
