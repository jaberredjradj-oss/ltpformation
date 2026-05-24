"use server";

import { revalidatePath } from "next/cache";
import { assertAdminAccess } from "@/lib/admin/auth";
import {
  devisStatusToEmailKind,
  preinscriptionStatusToEmailKind,
} from "@/lib/admin/decision-email-rules";
import type { DevisRequestStatus, PreinscriptionStatus } from "@/lib/admin/types";
import { getEmailProvider, isEmailEnabled } from "@/lib/email/env";
import { sendBrandedAdminEmail } from "@/lib/email/send-branded-admin-email";
import { buildDecisionEmailContent, extractFirstName } from "@/lib/email/templates";
import type { DecisionEmailEntityType } from "@/lib/email/types";
import {
  logDecisionEmailAttempt,
  updateDecisionEmailLogStatus,
} from "@/lib/notifications/decision-email";
import { getSubmissionsRepository } from "@/lib/repositories";

export interface PrepareDecisionEmailInput {
  entityType: DecisionEmailEntityType;
  entityId: string;
  newStatus: PreinscriptionStatus | DevisRequestStatus;
}

export interface PrepareDecisionEmailResult {
  recipient: string;
  subject: string;
  message: string;
  recipientLabel: string;
}

export type ConfirmDecisionEmailResult =
  | { ok: true; emailSkipped: boolean; warning?: string }
  | { ok: false; error: string };

function revalidateAdminPaths(entityType: DecisionEmailEntityType) {
  revalidatePath("/admin");
  if (entityType === "preinscription") {
    revalidatePath("/admin/preinscriptions");
  } else {
    revalidatePath("/admin/demandes");
  }
}

export async function prepareDecisionEmail(
  input: PrepareDecisionEmailInput,
): Promise<PrepareDecisionEmailResult> {
  await assertAdminAccess();

  const repo = await getSubmissionsRepository();

  if (input.entityType === "preinscription") {
    const status = input.newStatus as PreinscriptionStatus;
    const kind = preinscriptionStatusToEmailKind(status);
    if (!kind) {
      throw new Error("Statut sans email associé.");
    }

    const items = await repo.listPreinscriptions();
    const item = items.find((entry) => entry.id === input.entityId);
    if (!item) {
      throw new Error("Pré-inscription introuvable.");
    }

    const content = buildDecisionEmailContent(kind, {
      firstName: item.firstName,
      formationTitle: item.formationTitle,
    });

    return {
      recipient: item.email,
      subject: content.subject,
      message: content.message,
      recipientLabel: `${item.firstName} ${item.lastName}`.trim(),
    };
  }

  const status = input.newStatus as DevisRequestStatus;
  const kind = devisStatusToEmailKind(status);
  if (!kind) {
    throw new Error("Statut sans email associé.");
  }

  const requests = await repo.listDevisRequests();
  const request = requests.find((entry) => entry.id === input.entityId);
  if (!request) {
    throw new Error("Demande de devis introuvable.");
  }

  const content = buildDecisionEmailContent(kind, {
    firstName: extractFirstName(request.contactName),
    formationTitle: request.formationTitle,
  });

  return {
    recipient: request.email,
    subject: content.subject,
    message: content.message,
    recipientLabel: request.company,
  };
}

export async function confirmDecisionEmail(input: {
  entityType: DecisionEmailEntityType;
  entityId: string;
  newStatus: PreinscriptionStatus | DevisRequestStatus;
  subject: string;
  message: string;
}): Promise<ConfirmDecisionEmailResult> {
  await assertAdminAccess();

  const prepared = await prepareDecisionEmail({
    entityType: input.entityType,
    entityId: input.entityId,
    newStatus: input.newStatus,
  });

  const recipient = prepared.recipient.trim();
  const subject = input.subject.trim();
  const message = input.message.trim();

  if (!recipient || !subject || !message) {
    return { ok: false, error: "Destinataire, objet et message sont requis." };
  }

  const notificationType =
    input.entityType === "preinscription"
      ? (preinscriptionStatusToEmailKind(input.newStatus as PreinscriptionStatus) ?? "preinscription.decision")
      : (devisStatusToEmailKind(input.newStatus as DevisRequestStatus) ?? "devis.followup");

  const eventId = await logDecisionEmailAttempt({
    type: notificationType,
    status: "pending",
    payload: {
      recipient,
      subject,
      entityType: input.entityType,
      entityId: input.entityId,
      newStatus: input.newStatus,
      messagePreview: message.slice(0, 500),
      provider: isEmailEnabled() ? getEmailProvider() : "stub",
      error: null,
    },
  });

  const sendResult = await sendBrandedAdminEmail({ to: recipient, subject, message });

  if (!sendResult.ok) {
    await updateDecisionEmailLogStatus(eventId, "failed", { error: sendResult.error });
    return { ok: false, error: "Envoi impossible. Le statut n'a pas été modifié." };
  }

  const repo = await getSubmissionsRepository();

  if (input.entityType === "preinscription") {
    await repo.updatePreinscriptionStatus(input.entityId, input.newStatus as PreinscriptionStatus);
  } else {
    await repo.updateDevisStatus(input.entityId, input.newStatus as DevisRequestStatus);
  }

  if (sendResult.skipped) {
    await updateDecisionEmailLogStatus(eventId, "skipped", {
      provider: "stub",
      error: "provider_not_configured",
    });
    revalidateAdminPaths(input.entityType);
    return {
      ok: true,
      emailSkipped: true,
      warning: "Fournisseur email non configuré — statut mis à jour, email enregistré uniquement.",
    };
  }

  await updateDecisionEmailLogStatus(eventId, "sent", { error: null });
  revalidateAdminPaths(input.entityType);

  return { ok: true, emailSkipped: false };
}
