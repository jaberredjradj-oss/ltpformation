"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { AdminDevisRequest, DevisRequestStatus } from "@/lib/admin/types";
import { DEVIS_STATUS_LABELS } from "@/lib/admin/constants";
import { updateDevisStatus } from "@/lib/admin/actions";
import { isEmailTriggeringDevisStatus } from "@/lib/admin/decision-email-rules";
import {
  confirmDecisionEmail,
  prepareDecisionEmail,
} from "@/lib/admin/decision-email-actions";
import type { AdminTableColumnDef } from "@/lib/admin/data-table/types";
import { uniqueFilterOptions } from "@/lib/admin/data-table/process";
import { splitContactName } from "@/lib/admin/list-controls/utils";
import { AdminDecisionEmailDialog } from "@/components/admin/AdminDecisionEmailDialog";
import { AdminEntityDocumentsDialog } from "@/components/admin/documents/AdminEntityDocumentsDialog";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { TrashDeleteButton } from "@/components/admin/TrashDeleteButton";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { adminStyles } from "@/components/admin/admin-styles";
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

interface DevisRequestsTableProps {
  requests: AdminDevisRequest[];
}

interface EmailDialogState {
  entityId: string;
  newStatus: DevisRequestStatus;
  recipient: string;
  recipientLabel: string;
  subject: string;
  message: string;
}

function statusTone(status: AdminDevisRequest["status"]) {
  if (status === "new") return "gold" as const;
  if (status === "contacted") return "blue" as const;
  if (status === "processed") return "success" as const;
  return "neutral" as const;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

const DEVIS_COLUMNS: AdminTableColumnDef<AdminDevisRequest>[] = [
  {
    id: "company",
    label: "Entreprise",
    sortable: true,
    filterable: true,
    getFilterValue: (item) => item.company,
    getFilterOptions: (items) => uniqueFilterOptions(items.map((item) => item.company)),
    getSortValue: (item) => item.company,
  },
  {
    id: "contact",
    label: "Contact",
    sortable: true,
    getSortValue: (item) => item.contactName,
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
    id: "status",
    label: "Statut",
    sortable: true,
    filterable: true,
    getFilterValue: (item) => item.status,
    getFilterOptions: (items) =>
      uniqueFilterOptions(
        items.map((item) => item.status),
        (value) => DEVIS_STATUS_LABELS[value as DevisRequestStatus],
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

export function DevisRequestsTable({ requests }: DevisRequestsTableProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [pending, startTransition] = useTransition();
  const [emailDialog, setEmailDialog] = useState<EmailDialogState | null>(null);
  const [documentsDialog, setDocumentsDialog] = useState<DocumentsDialogState | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  const table = useAdminTable({
    items: requests,
    columns: DEVIS_COLUMNS,
    defaultSortColumn: "date",
    defaultSortDirection: "desc",
    getSearchFields: (item) => {
      const { firstName, lastName } = splitContactName(item.contactName);
      return [
        item.company,
        item.contactName,
        firstName,
        lastName,
        item.email,
        item.phone,
        item.formationTitle,
        item.sessionLabel,
      ];
    },
    getSubmittedAt: (item) => item.submittedAt,
  });

  const filterOptionsByColumn = useMemo(() => {
    const map = new Map<string, Array<{ value: string; label: string }>>();
    for (const column of DEVIS_COLUMNS) {
      if (column.filterable && column.getFilterOptions) {
        map.set(column.id, column.getFilterOptions(requests));
      }
    }
    return map;
  }, [requests]);

  const actionsDisabled = pending || sendingEmail;

  async function handleStatusChange(request: AdminDevisRequest, status: DevisRequestStatus) {
    if (status === request.status) return;

    if (!isEmailTriggeringDevisStatus(status)) {
      try {
        await updateDevisStatus(request.id, status);
        showToast("Statut mis à jour.");
        startTransition(() => router.refresh());
      } catch {
        showToast("Mise à jour impossible.", "error");
      }
      return;
    }

    try {
      const prepared = await prepareDecisionEmail({
        entityType: "devis",
        entityId: request.id,
        newStatus: status,
      });

      setEmailDialog({
        entityId: request.id,
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
        entityType: "devis",
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

  function renderRow(request: AdminDevisRequest) {
    return (
      <AdminTableRow key={request.id}>
        <AdminTableCell>
          <p className="font-semibold break-words text-navy-950">{request.company}</p>
        </AdminTableCell>
        <AdminTableCell>
          <p className="break-words text-sm font-medium text-navy-950">{request.contactName}</p>
          <p className="mt-1 break-words text-xs text-body-strong">{request.email}</p>
          <p className="mt-0.5 text-xs text-body-strong">{request.phone}</p>
        </AdminTableCell>
        <AdminTableCell>
          <p className="break-words text-sm">{request.formationTitle}</p>
          <p className="mt-1 text-xs text-body-strong">
            {request.sessionLabel ?? "Session non précisée"}
          </p>
          <p className="mt-0.5 text-xs tabular-nums">{request.participantCount} participants</p>
        </AdminTableCell>
        <AdminTableCell>
          <div className="space-y-2">
            <AdminStatusBadge
              label={DEVIS_STATUS_LABELS[request.status]}
              tone={statusTone(request.status)}
            />
            <AdminStatusSelect
              value={request.status}
              options={DEVIS_STATUS_LABELS}
              disabled={actionsDisabled}
              onChange={(status) => handleStatusChange(request, status)}
            />
          </div>
        </AdminTableCell>
        <AdminTableCell className="whitespace-nowrap text-xs text-lead-strong">
          {formatDate(request.submittedAt)}
        </AdminTableCell>
        <AdminTableCell>
          <div className="flex flex-wrap gap-2">
            <AdminActionButton
              label="Documents"
              onClick={() =>
                setDocumentsDialog({
                  entityId: request.id,
                  entityLabel: request.company,
                })
              }
            />
            <TrashDeleteButton
              entityType="devis"
              id={request.id}
              label={request.company}
              disabled={actionsDisabled}
            />
          </div>
        </AdminTableCell>
      </AdminTableRow>
    );
  }

  function renderMobileCard(request: AdminDevisRequest) {
    return (
      <div
        key={request.id}
        className={adminStyles.mobileCard}
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-base font-semibold break-words text-navy-950">{request.company}</p>
          <AdminStatusBadge
            label={DEVIS_STATUS_LABELS[request.status]}
            tone={statusTone(request.status)}
          />
        </div>
        <p className="mt-2 text-sm font-medium text-navy-950">{request.contactName}</p>
        <p className="mt-1 break-words text-sm text-body-strong">
          {request.email} • {request.phone}
        </p>
        <div className="mt-3 space-y-1 break-words text-sm">
          <p>
            <span className="font-medium text-body-strong">Formation :</span>{" "}
            {request.formationTitle}
          </p>
          <p>
            <span className="font-medium text-body-strong">Session :</span>{" "}
            {request.sessionLabel ?? "Non précisée"}
          </p>
          <p>
            <span className="font-medium text-body-strong">Participants :</span>{" "}
            {request.participantCount}
          </p>
          <p className="text-xs text-lead-strong">{formatDate(request.submittedAt)}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          <AdminActionButton
            label="Documents"
            onClick={() =>
              setDocumentsDialog({
                entityId: request.id,
                entityLabel: request.company,
              })
            }
          />
          <TrashDeleteButton
            entityType="devis"
            id={request.id}
            label={request.company}
            disabled={actionsDisabled}
          />
        </div>
        <div className="mt-3">
          <AdminStatusSelect
            value={request.status}
            options={DEVIS_STATUS_LABELS}
            disabled={actionsDisabled}
            onChange={(status) => handleStatusChange(request, status)}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Demandes entreprises"
        title="Demandes de devis"
        description="Liste structurée avec recherche, tri et pagination."
      />

      {requests.length === 0 ? (
        <AdminEmptyState
          title="Aucune demande de devis"
          description="Les nouvelles demandes apparaîtront ici dès leur envoi."
        />
      ) : (
        <>
          <AdminTableToolbar
            search={table.search}
            onSearchChange={table.setSearch}
            searchPlaceholder="Entreprise, contact, email, formation, session…"
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
              description="Aucune demande ne correspond à votre recherche."
            />
          ) : (
            <>
              <div className="space-y-3 md:hidden">{table.rows.map(renderMobileCard)}</div>

              <AdminDataTable className="hidden md:block">
                <AdminTable>
                  <AdminTableHead>
                    <tr>
                      <AdminTableColumnHeader
                        label="Entreprise"
                        columnId="company"
                        sortable
                        filterable
                        sortColumn={table.sortColumn}
                        sortDirection={table.sortDirection}
                        filterValue={table.columnFilters.company ?? "all"}
                        filterOptions={filterOptionsByColumn.get("company")}
                        onSort={table.toggleSort}
                        onFilterChange={table.setColumnFilter}
                      />
                      <AdminTableColumnHeader
                        label="Contact"
                        columnId="contact"
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
                      <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
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
        entityType="devis"
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
