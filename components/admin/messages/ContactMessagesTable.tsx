"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminContactMessage, ContactMessageStatus } from "@/lib/admin/types";
import { MESSAGE_STATUS_LABELS } from "@/lib/admin/constants";
import { updateContactMessageStatus } from "@/lib/admin/actions";
import {
  confirmMessageReply,
  prepareMessageReply,
} from "@/lib/admin/message-reply-actions";
import type { AdminTableColumnDef } from "@/lib/admin/data-table/types";
import { uniqueFilterOptions } from "@/lib/admin/data-table/process";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { AdminDecisionEmailDialog } from "@/components/admin/AdminDecisionEmailDialog";
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

interface ContactMessagesTableProps {
  messages: AdminContactMessage[];
}

interface ReplyDialogState {
  messageId: string;
  recipient: string;
  recipientLabel: string;
  subject: string;
  message: string;
  originalMessage: string;
}

function statusTone(status: AdminContactMessage["status"]) {
  if (status === "unread") return "gold" as const;
  if (status === "answered") return "success" as const;
  return "neutral" as const;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

const MESSAGE_COLUMNS: AdminTableColumnDef<AdminContactMessage>[] = [
  {
    id: "name",
    label: "Expéditeur",
    sortable: true,
    getSortValue: (item) => `${item.lastName} ${item.firstName}`,
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
        (value) => MESSAGE_STATUS_LABELS[value as ContactMessageStatus],
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

export function ContactMessagesTable({ messages }: ContactMessagesTableProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [pending, startTransition] = useTransition();
  const [replyDialog, setReplyDialog] = useState<ReplyDialogState | null>(null);
  const [sendingReply, setSendingReply] = useState(false);

  const table = useAdminTable({
    items: messages,
    columns: MESSAGE_COLUMNS,
    defaultSortColumn: "date",
    defaultSortDirection: "desc",
    getSearchFields: (item) => [
      item.firstName,
      item.lastName,
      item.email,
      item.phone,
      item.message,
    ],
    getSubmittedAt: (item) => item.submittedAt,
  });

  const filterOptionsByColumn = useMemo(() => {
    const map = new Map<string, Array<{ value: string; label: string }>>();
    for (const column of MESSAGE_COLUMNS) {
      if (column.filterable && column.getFilterOptions) {
        map.set(column.id, column.getFilterOptions(messages));
      }
    }
    return map;
  }, [messages]);

  const actionsDisabled = pending || sendingReply;

  async function handleStatusChange(id: string, status: ContactMessageStatus) {
    try {
      await updateContactMessageStatus(id, status);
      showToast("Statut mis à jour.");
      startTransition(() => router.refresh());
    } catch {
      showToast("Mise à jour impossible.", "error");
    }
  }

  async function handleReplyClick(item: AdminContactMessage) {
    try {
      const prepared = await prepareMessageReply(item.id);
      setReplyDialog({
        messageId: item.id,
        recipient: prepared.recipient,
        recipientLabel: prepared.recipientLabel,
        subject: prepared.subject,
        message: prepared.message,
        originalMessage: item.message,
      });
    } catch {
      showToast("Préparation de la réponse impossible.", "error");
    }
  }

  async function handleSendReply() {
    if (!replyDialog) return;

    setSendingReply(true);
    try {
      const result = await confirmMessageReply({
        messageId: replyDialog.messageId,
        subject: replyDialog.subject,
        message: replyDialog.message,
      });

      if (!result.ok) {
        showToast(result.error, "error");
        return;
      }

      setReplyDialog(null);
      if (result.warning) {
        showToast(result.warning, "error");
      } else {
        showToast("Réponse envoyée — message marqué comme traité.");
      }
      startTransition(() => router.refresh());
    } catch {
      showToast("Envoi impossible.", "error");
    } finally {
      setSendingReply(false);
    }
  }

  function renderActions(item: AdminContactMessage) {
    return (
      <div className="flex min-w-[120px] flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleReplyClick(item)}
          disabled={actionsDisabled || item.status === "archived"}
          className={adminStyles.btnAccent}
        >
          Répondre
        </button>
      </div>
    );
  }

  function renderRow(message: AdminContactMessage) {
    return (
      <AdminTableRow
        key={message.id}
        className={message.status === "unread" ? "bg-amber-50/35" : undefined}
      >
        <AdminTableCell>
          <p className="font-semibold break-words text-slate-900">
            {message.firstName} {message.lastName}
          </p>
          <p className="mt-1 break-words text-xs text-slate-600">{message.email}</p>
          {message.phone && (
            <p className="mt-0.5 text-xs text-slate-500">{message.phone}</p>
          )}
        </AdminTableCell>
        <AdminTableCell>
          <p className="max-w-xl break-words text-sm leading-relaxed text-slate-800">
            {message.message}
          </p>
        </AdminTableCell>
        <AdminTableCell>
          <div className="space-y-2">
            <AdminStatusBadge
              label={MESSAGE_STATUS_LABELS[message.status]}
              tone={statusTone(message.status)}
            />
            <AdminStatusSelect
              value={message.status}
              options={MESSAGE_STATUS_LABELS}
              disabled={actionsDisabled}
              onChange={(status) => handleStatusChange(message.id, status)}
            />
          </div>
        </AdminTableCell>
        <AdminTableCell className="whitespace-nowrap text-xs text-slate-500">
          {formatDate(message.submittedAt)}
        </AdminTableCell>
        <AdminTableCell>{renderActions(message)}</AdminTableCell>
      </AdminTableRow>
    );
  }

  function renderMobileCard(message: AdminContactMessage) {
    return (
      <div
        key={message.id}
        className={`${adminStyles.mobileCard} ${
          message.status === "unread" ? "border-amber-200 bg-amber-50/40" : ""
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-base font-semibold break-words text-slate-900">
            {message.firstName} {message.lastName}
          </p>
          <AdminStatusBadge
            label={MESSAGE_STATUS_LABELS[message.status]}
            tone={statusTone(message.status)}
          />
        </div>
        <p className="mt-2 break-words text-sm text-slate-600">{message.email}</p>
        {message.phone && (
          <p className="mt-0.5 text-sm text-slate-500">{message.phone}</p>
        )}
        <p className="mt-3 break-words text-sm leading-relaxed text-slate-800">
          {message.message}
        </p>
        <p className="mt-2 text-xs text-slate-500">{formatDate(message.submittedAt)}</p>
        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={() => handleReplyClick(message)}
            disabled={actionsDisabled || message.status === "archived"}
            className={adminStyles.btnAccent}
          >
            Répondre
          </button>
        </div>
        <div className="mt-3">
          <AdminStatusSelect
            value={message.status}
            options={MESSAGE_STATUS_LABELS}
            disabled={actionsDisabled}
            onChange={(status) => handleStatusChange(message.id, status)}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Contact rapide"
        title="Messages reçus"
        description="Consultez les messages, répondez par email et suivez leur statut."
      />

      {messages.length === 0 ? (
        <AdminEmptyState
          title="Aucun message"
          description="Les nouveaux messages apparaîtront ici dès leur envoi."
        />
      ) : (
        <>
          <AdminTableToolbar
            search={table.search}
            onSearchChange={table.setSearch}
            searchPlaceholder="Nom, email, contenu du message…"
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
              description="Aucun message ne correspond à votre recherche."
            />
          ) : (
            <>
              <div className="space-y-3 md:hidden">{table.rows.map(renderMobileCard)}</div>

              <AdminDataTable className="hidden md:block">
                <AdminTable>
                  <AdminTableHead>
                    <tr>
                      <AdminTableColumnHeader
                        label="Expéditeur"
                        columnId="name"
                        sortable
                        sortColumn={table.sortColumn}
                        sortDirection={table.sortDirection}
                        onSort={table.toggleSort}
                      />
                      <th className="px-4 py-3 font-medium text-slate-600">Message</th>
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

              <div className={`md:hidden ${adminStyles.surface}`}>
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

      <AdminDecisionEmailDialog
        open={replyDialog !== null}
        title="Répondre au message"
        description="Votre réponse sera envoyée par email. Le message sera marqué comme traité après envoi."
        submitLabel="Envoyer la réponse"
        recipient={replyDialog?.recipient ?? ""}
        recipientLabel={replyDialog?.recipientLabel}
        contextLabel="Message reçu"
        contextContent={replyDialog?.originalMessage}
        subject={replyDialog?.subject ?? ""}
        message={replyDialog?.message ?? ""}
        sending={sendingReply}
        onSubjectChange={(value) =>
          setReplyDialog((current) => (current ? { ...current, subject: value } : current))
        }
        onMessageChange={(value) =>
          setReplyDialog((current) => (current ? { ...current, message: value } : current))
        }
        onSend={handleSendReply}
        onCancel={() => setReplyDialog(null)}
      />
    </>
  );
}
