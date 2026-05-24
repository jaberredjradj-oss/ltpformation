"use client";

import type { AdminDevisRequest, DevisRequestStatus } from "@/lib/admin/types";
import { DEVIS_STATUS_LABELS } from "@/lib/admin/constants";
import {
  AdminOperationalCard,
  AdminOperationalCardContact,
  AdminOperationalCardContext,
  AdminOperationalCardFooter,
  AdminOperationalCardHeader,
  AdminOperationalContextLine,
  AdminOperationalStatusControl,
} from "@/components/admin/AdminOperationalCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminStatusSelect } from "@/components/admin/AdminStatusSelect";

interface AdminDevisRequestCardProps {
  request: AdminDevisRequest;
  hideIdentity: boolean;
  hideContext: boolean;
  hideStatusBadge: boolean;
  disabled?: boolean;
  onStatusChange: (status: DevisRequestStatus) => void;
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
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function AdminDevisRequestCard({
  request,
  hideIdentity,
  hideContext,
  hideStatusBadge,
  disabled = false,
  onStatusChange,
}: AdminDevisRequestCardProps) {
  const title = hideIdentity ? request.contactName : request.company;
  const subtitle = hideIdentity ? null : request.contactName;

  return (
    <AdminOperationalCard>
      <AdminOperationalCardHeader
        title={title}
        badge={
          !hideStatusBadge ? (
            <AdminStatusBadge
              label={DEVIS_STATUS_LABELS[request.status]}
              tone={statusTone(request.status)}
              className="px-3 py-1.5 text-[11px]"
            />
          ) : null
        }
      />

      <AdminOperationalCardContact>
        {subtitle && <span className="font-medium text-navy-950">{subtitle} — </span>}
        {request.email} • {request.phone}
      </AdminOperationalCardContact>

      <AdminOperationalCardContext>
        {!hideContext && (
          <AdminOperationalContextLine label="Formation">
            {request.formationTitle}
          </AdminOperationalContextLine>
        )}
        {!hideContext && (
          <AdminOperationalContextLine label="Session">
            {request.sessionLabel ?? "Non précisée"}
          </AdminOperationalContextLine>
        )}
        <AdminOperationalContextLine label="Participants">
          {request.participantCount}
        </AdminOperationalContextLine>
        <AdminOperationalContextLine label="Reçu le">
          {formatDate(request.submittedAt)}
        </AdminOperationalContextLine>
      </AdminOperationalCardContext>

      <AdminOperationalCardFooter
        statusControl={
          <AdminOperationalStatusControl label="Changer statut">
            <AdminStatusSelect
              value={request.status}
              options={DEVIS_STATUS_LABELS}
              disabled={disabled}
              onChange={onStatusChange}
            />
          </AdminOperationalStatusControl>
        }
      />
    </AdminOperationalCard>
  );
}
