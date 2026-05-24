"use client";

import type { AdminPreinscription, PreinscriptionStatus } from "@/lib/admin/types";
import { PREINSCRIPTION_STATUS_LABELS } from "@/lib/admin/constants";
import {
  AdminOperationalCard,
  AdminOperationalCardContact,
  AdminOperationalCardContext,
  AdminOperationalCardFooter,
  AdminOperationalCardHeader,
  AdminOperationalContextLine,
  AdminOperationalPrimaryButton,
  AdminOperationalSecondaryButton,
  AdminOperationalStatusControl,
} from "@/components/admin/AdminOperationalCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminStatusSelect } from "@/components/admin/AdminStatusSelect";

interface AdminPreinscriptionCardProps {
  item: AdminPreinscription;
  hideContext: boolean;
  disabled?: boolean;
  onStatusChange: (status: PreinscriptionStatus) => void;
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
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

function sheetUrl(id: string, download = false): string {
  const base = `/admin/preinscriptions/${id}/sheet`;
  return download ? `${base}?download=1` : base;
}

export function AdminPreinscriptionCard({
  item,
  hideContext,
  disabled = false,
  onStatusChange,
}: AdminPreinscriptionCardProps) {
  const fullName = `${item.firstName} ${item.lastName}`;

  return (
    <AdminOperationalCard>
      <AdminOperationalCardHeader
        title={fullName}
        badge={
          <AdminStatusBadge
            label={PREINSCRIPTION_STATUS_LABELS[item.status]}
            tone={statusTone(item.status)}
            className="px-3 py-1.5 text-[11px]"
          />
        }
      />

      <AdminOperationalCardContact>
        {item.email} • {item.phone}
      </AdminOperationalCardContact>

      <AdminOperationalCardContext>
        {!hideContext && (
          <AdminOperationalContextLine label="Formation">
            {item.formationTitle}
          </AdminOperationalContextLine>
        )}
        {!hideContext && (
          <AdminOperationalContextLine label="Session">
            {item.sessionLabel}
          </AdminOperationalContextLine>
        )}
        <AdminOperationalContextLine label="CPF">
          {item.cpfFinancing ?? "—"}
        </AdminOperationalContextLine>
        <AdminOperationalContextLine label="Reçu le">
          {formatDate(item.submittedAt)}
        </AdminOperationalContextLine>
      </AdminOperationalCardContext>

      <AdminOperationalCardFooter
        primaryActions={
          <>
            <AdminOperationalPrimaryButton label="Voir fiche" href={sheetUrl(item.id)} />
            <AdminOperationalSecondaryButton label="PDF" href={sheetUrl(item.id, true)} />
            <AdminOperationalSecondaryButton
              label="Imprimer"
              onClick={() =>
                window.open(
                  `/admin/preinscriptions/${item.id}/print`,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            />
          </>
        }
        statusControl={
          <AdminOperationalStatusControl label="Changer statut">
            <AdminStatusSelect
              value={item.status}
              options={PREINSCRIPTION_STATUS_LABELS}
              disabled={disabled}
              onChange={onStatusChange}
            />
          </AdminOperationalStatusControl>
        }
      />
    </AdminOperationalCard>
  );
}
