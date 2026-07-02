"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { AdminPreinscription, PreinscriptionStatus } from "@/lib/admin/types";
import { PREINSCRIPTION_STATUS_LABELS } from "@/lib/admin/constants";
import { updatePreinscriptionStatus } from "@/lib/admin/actions";
import { isEmailTriggeringPreinscriptionStatus } from "@/lib/admin/decision-email-rules";
import {
  confirmDecisionEmail,
  prepareDecisionEmail,
} from "@/lib/admin/decision-email-actions";
import type { AdminTableColumnDef } from "@/lib/admin/data-table/types";
import { uniqueFilterOptions } from "@/lib/admin/data-table/process";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { TrashDeleteButton } from "@/components/admin/TrashDeleteButton";
import { adminStyles } from "@/components/admin/admin-styles";
import { AdminDecisionEmailDialog } from "@/components/admin/AdminDecisionEmailDialog";
import { AdminEntityDocumentsDialog } from "@/components/admin/documents/AdminEntityDocumentsDialog";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminStatusSelect } from "@/components/admin/AdminStatusSelect";
import { useAdminToast } from "@/components/admin/AdminToast";
import {
  AdminDataTable,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableRow,
} from "@/components/admin/AdminDataTable";
import { AdminTableColumnHeader } from "@/components/admin/data-table/AdminTableColumnHeader";
import { AdminTablePagination } from "@/components/admin/data-table/AdminTablePagination";
import { AdminTableToolbar } from "@/components/admin/data-table/AdminTableToolbar";
import { useAdminTable } from "@/components/admin/data-table/useAdminTable";

interface PreinscriptionsTableProps {
  items: AdminPreinscription[];
}

interface EmailDialogState {
  entityId: string;
  newStatus: PreinscriptionStatus;
  recipient: string;
  recipientLabel: string;
  subject: string;
  message: string;
}

function statusTone(status: AdminPreinscription["status"]) {
  if (status === "pending") return "gold" as const;
  if (status === "validated") return "success" as const;
  if (status === "refused") return "danger" as const;
  return "neutral" as const;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function sheetUrl(id: string, download = false): string {
  const base = `/admin/preinscriptions/${id}/sheet`;
  return download ? `${base}?download=1` : base;
}

const PREINSCRIPTION_COLUMNS: AdminTableColumnDef<AdminPreinscription>[] = [
  {
    id: "name",
    label: "Candidat",
    sortable: true,
    getSortValue: (item) => `${item.lastName} ${item.firstName}`,
  },
  {
    id: "formation",
    label: "Formation",
    sortable: true,
    filterable: true,
    getFilterValue: (item) => item.formationTitle,
    getFilterOptions: (items) => uniqueFilterOptions(items.map((item) => item.formationTitle)),
    getSortValue: (item) => item.formationTitle,
  },
  {
    id: "session",
    label: "Session",
    sortable: true,
    filterable: true,
    getFilterValue: (item) => item.sessionLabel,
    getFilterOptions: (items) => uniqueFilterOptions(items.map((item) => item.sessionLabel)),
    getSortValue: (item) => item.sessionLabel,
  },
  {
    id: "status",
    label: "Statut",
    sortable: true,
    filterable: true,
    getFilterValue: (item) => item.status,
    getFilterOptions: (items) =>
      uniqueFilterOptions(
        items.map((item) => item.status),
        (value) => PREINSCRIPTION_STATUS_LABELS[value as PreinscriptionStatus],
      ),
    getSortValue: (item) => item.status,
  },
  {
    id: "date",
    label: "Reçu le",
    sortable: true,
    getSortValue: (item) => new Date(item.submittedAt).getTime(),
  },
];

interface DocumentsDialogState {
  entityId: string;
  entityLabel: string;
}

export function PreinscriptionsTable({ items }: PreinscriptionsTableProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [pending, startTransition] = useTransition();
  const [emailDialog, setEmailDialog] = useState<EmailDialogState | null>(null);
  const [documentsDialog, setDocumentsDialog] = useState<DocumentsDialogState | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  const table = useAdminTable({
    items,
    columns: PREINSCRIPTION_COLUMNS,
    defaultSortColumn: "date",
    defaultSortDirection: "desc",
    getSearchFields: (item) => [
      item.firstName,
      item.lastName,
      item.email,
      item.phone,
      item.formationTitle,
      item.sessionLabel,
    ],
    getSubmittedAt: (item) => item.submittedAt,
  });

  const filterOptionsByColumn = useMemo(() => {
    const map = new Map<string, Array<{ value: string; label: string }>>();
    for (const column of PREINSCRIPTION_COLUMNS) {
      if (column.filterable && column.getFilterOptions) {
        map.set(column.id, column.getFilterOptions(items));
      }
    }
    return map;
  }, [items]);

  const actionsDisabled = pending || sendingEmail;

  async function handleStatusChange(item: AdminPreinscription, status: PreinscriptionStatus) {
    if (status === item.status) return;

    if (!isEmailTriggeringPreinscriptionStatus(status)) {
      try {
        await updatePreinscriptionStatus(item.id, status);
        showToast("Statut mis à jour.");
        startTransition(() => router.refresh());
      } catch {
        showToast("Mise à jour impossible.", "error");
      }
      return;
    }

    try {
      const prepared = await prepareDecisionEmail({
        entityType: "preinscription",
        entityId: item.id,
        newStatus: status,
      });

      setEmailDialog({
        entityId: item.id,
        newStatus: status,
        recipient: prepared.recipient,
        recipientLabel: prepared.recipientLabel,
        subject: prepared.subject,
        message: prepared.message,
      });
    } catch {
      showToast("Préparation de l'email impossible.", "error");
    }
  }

  async function handleSendEmail() {
    if (!emailDialog) return;

    setSendingEmail(true);
    try {
      const result = await confirmDecisionEmail({
        entityType: "preinscription",
        entityId: emailDialog.entityId,
        newStatus: emailDialog.newStatus,
        subject: emailDialog.subject,
        message: emailDialog.message,
      });

      if (!result.ok) {
        showToast(result.error, "error");
        return;
      }

      setEmailDialog(null);
      if (result.warning) {
        showToast(result.warning, "error");
      } else {
        showToast("Email envoyé et statut mis à jour.");
      }
      startTransition(() => router.refresh());
    } catch {
      showToast("Envoi impossible.", "error");
    } finally {
      setSendingEmail(false);
    }
  }

  function renderRow(item: AdminPreinscription) {
    return (
      <AdminTableRow key={item.id}>
        <AdminTableCell>
          <p className="font-semibold break-words text-navy-950">
            {item.firstName} {item.lastName}
          </p>
          <p className="mt-1 break-words text-xs text-body-strong">{item.email}</p>
          <p className="mt-0.5 text-xs text-body-strong">{item.phone}</p>
        </AdminTableCell>
        <AdminTableCell>
          <p className="break-words text-sm">{item.formationTitle}</p>
        </AdminTableCell>
        <AdminTableCell>
          <p className="break-words text-sm">{item.sessionLabel}</p>
        </AdminTableCell>
        <AdminTableCell>
          <div className="space-y-2">
            <AdminStatusBadge
              label={PREINSCRIPTION_STATUS_LABELS[item.status]}
              tone={statusTone(item.status)}
            />
            <AdminStatusSelect
              value={item.status}
              options={PREINSCRIPTION_STATUS_LABELS}
              disabled={actionsDisabled}
              onChange={(status) => handleStatusChange(item, status)}
            />
          </div>
        </AdminTableCell>
        <AdminTableCell>
          <p className="whitespace-nowrap text-xs text-lead-strong">
            {formatDate(item.submittedAt)}
          </p>
          <p className="mt-1 text-xs text-body-strong">
            CPF : {item.cpfFinancing ?? "—"}
          </p>
        </AdminTableCell>
        <AdminTableCell>
          <div className="flex min-w-[140px] flex-wrap gap-2">
            <AdminActionButton
              label="Voir fiche"
              onClick={() => window.open(sheetUrl(item.id), "_blank", "noopener,noreferrer")}
            />
            <AdminActionButton label="PDF" href={sheetUrl(item.id, true)} />
            <AdminActionButton
              label="Documents"
              onClick={() =>
                setDocumentsDialog({
                  entityId: item.id,
                  entityLabel: `${item.firstName} ${item.lastName}`,
                })
              }
            />
            <AdminActionButton
              label="Imprimer"
              onClick={() =>
                window.open(
                  `/admin/preinscriptions/${item.id}/print`,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            />
            <TrashDeleteButton
              entityType="preinscription"
              id={item.id}
              label={`${item.firstName} ${item.lastName}`}
              disabled={actionsDisabled}
            />
          </div>
        </AdminTableCell>
      </AdminTableRow>
    );
  }

  function renderMobileCard(item: AdminPreinscription) {
    return (
      <div
        key={item.id}
        className={adminStyles.mobileCard}
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-base font-semibold break-words text-navy-950">
            {item.firstName} {item.lastName}
          </p>
          <AdminStatusBadge
            label={PREINSCRIPTION_STATUS_LABELS[item.status]}
            tone={statusTone(item.status)}
          />
        </div>
        <p className="mt-2 break-words text-sm text-body-strong">
          {item.email} • {item.phone}
        </p>
        <div className="mt-3 space-y-1 text-sm break-words">
          <p>
            <span className="font-medium text-body-strong">Formation :</span> {item.formationTitle}
          </p>
          <p>
            <span className="font-medium text-body-strong">Session :</span> {item.sessionLabel}
          </p>
          <p>
            <span className="font-medium text-body-strong">CPF :</span>{" "}
            {item.cpfFinancing ?? "—"}
          </p>
          <p className="text-xs text-lead-strong">{formatDate(item.submittedAt)}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          <AdminActionButton
            label="Voir fiche"
            onClick={() => window.open(sheetUrl(item.id), "_blank", "noopener,noreferrer")}
          />
          <AdminActionButton label="PDF" href={sheetUrl(item.id, true)} />
          <AdminActionButton
            label="Documents"
            onClick={() =>
              setDocumentsDialog({
                entityId: item.id,
                entityLabel: `${item.firstName} ${item.lastName}`,
              })
            }
          />
          <AdminActionButton
            label="Imprimer"
            onClick={() =>
              window.open(
                `/admin/preinscriptions/${item.id}/print`,
                "_blank",
                "noopener,noreferrer",
              )
            }
          />
          <TrashDeleteButton
            entityType="preinscription"
            id={item.id}
            label={`${item.firstName} ${item.lastName}`}
            disabled={actionsDisabled}
          />
        </div>
        <div className="mt-3">
          <AdminStatusSelect
            value={item.status}
            options={PREINSCRIPTION_STATUS_LABELS}
            disabled={actionsDisabled}
            onChange={(status) => handleStatusChange(item, status)}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Candidats individuels"
        title="Pré-inscriptions"
        description="Liste structurée avec recherche, tri et pagination."
      />

      {items.length === 0 ? (
        <AdminEmptyState
          title="Aucune pré-inscription"
          description="Les nouvelles pré-inscriptions apparaîtront ici dès leur envoi."
        />
      ) : (
        <>
          <AdminTableToolbar
            search={table.search}
            onSearchChange={table.setSearch}
            searchPlaceholder="Nom, email, téléphone, formation, session…"
            dateFrom={table.dateFrom}
            dateTo={table.dateTo}
            onDateFromChange={table.setDateFrom}
            onDateToChange={table.setDateTo}
            resultCount={table.totalCount}
            totalCount={table.totalItems}
            onReset={table.reset}
          />

          {table.totalCount === 0 ? (
            <AdminEmptyState
              title="Aucun résultat"
              description="Aucune pré-inscription ne correspond à votre recherche."
            />
          ) : (
            <>
              <div className="space-y-3 md:hidden">
                {table.rows.map(renderMobileCard)}
              </div>

              <AdminDataTable className="hidden md:block">
                <AdminTable>
                  <AdminTableHead>
                    <tr>
                      <AdminTableColumnHeader
                        label="Candidat"
                        columnId="name"
                        sortable
                        sortColumn={table.sortColumn}
                        sortDirection={table.sortDirection}
                        onSort={table.toggleSort}
                      />
                      <AdminTableColumnHeader
                        label="Formation"
                        columnId="formation"
                        sortable
                        filterable
                        sortColumn={table.sortColumn}
                        sortDirection={table.sortDirection}
                        filterValue={table.columnFilters.formation ?? "all"}
                        filterOptions={filterOptionsByColumn.get("formation")}
                        onSort={table.toggleSort}
                        onFilterChange={table.setColumnFilter}
                      />
                      <AdminTableColumnHeader
                        label="Session"
                        columnId="session"
                        sortable
                        filterable
                        sortColumn={table.sortColumn}
                        sortDirection={table.sortDirection}
                        filterValue={table.columnFilters.session ?? "all"}
                        filterOptions={filterOptionsByColumn.get("session")}
                        onSort={table.toggleSort}
                        onFilterChange={table.setColumnFilter}
                      />
                      <AdminTableColumnHeader
                        label="Statut"
                        columnId="status"
                        sortable
                        filterable
                        sortColumn={table.sortColumn}
                        sortDirection={table.sortDirection}
                        filterValue={table.columnFilters.status ?? "all"}
                        filterOptions={filterOptionsByColumn.get("status")}
                        onSort={table.toggleSort}
                        onFilterChange={table.setColumnFilter}
                      />
                      <AdminTableColumnHeader
                        label="Reçu le"
                        columnId="date"
                        sortable
                        sortColumn={table.sortColumn}
                        sortDirection={table.sortDirection}
                        onSort={table.toggleSort}
                      />
                      <th className="px-4 py-3 font-medium text-blue-600">Actions</th>
                    </tr>
                  </AdminTableHead>
                  <AdminTableBody>{table.rows.map(renderRow)}</AdminTableBody>
                </AdminTable>
                <AdminTablePagination
                  page={table.page}
                  totalPages={table.totalPages}
                  pageSize={table.pageSize}
                  totalCount={table.totalCount}
                  onPageChange={table.setPage}
                  onPageSizeChange={table.setPageSize}
                />
              </AdminDataTable>

              <div className="rounded-2xl border border-slate-200/90 bg-white md:hidden">
                <AdminTablePagination
                  page={table.page}
                  totalPages={table.totalPages}
                  pageSize={table.pageSize}
                  totalCount={table.totalCount}
                  onPageChange={table.setPage}
                  onPageSizeChange={table.setPageSize}
                />
              </div>
            </>
          )}
        </>
      )}

      <AdminEntityDocumentsDialog
        open={documentsDialog !== null}
        entityType="preinscription"
        entityId={documentsDialog?.entityId ?? ""}
        entityLabel={documentsDialog?.entityLabel ?? ""}
        onClose={() => setDocumentsDialog(null)}
      />

      <AdminDecisionEmailDialog
        open={emailDialog !== null}
        recipient={emailDialog?.recipient ?? ""}
        recipientLabel={emailDialog?.recipientLabel}
        subject={emailDialog?.subject ?? ""}
        message={emailDialog?.message ?? ""}
        sending={sendingEmail}
        onSubjectChange={(subject) =>
          setEmailDialog((current) => (current ? { ...current, subject } : current))
        }
        onMessageChange={(message) =>
          setEmailDialog((current) => (current ? { ...current, message } : current))
        }
        onSend={handleSendEmail}
        onCancel={() => setEmailDialog(null)}
      />
    </>
  );
}
