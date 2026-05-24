"use server";

import { revalidatePath } from "next/cache";
import { assertAdminAccess } from "@/lib/admin/auth";
import { getEmailProvider, isEmailEnabled } from "@/lib/email/env";
import { sendBrandedAdminEmail } from "@/lib/email/send-branded-admin-email";
import { buildContactReplyContent } from "@/lib/email/templates";
import {
  logDecisionEmailAttempt,
  updateDecisionEmailLogStatus,
} from "@/lib/notifications/decision-email";
import { getMessagesRepository } from "@/lib/repositories";

export interface PrepareMessageReplyResult {
  recipient: string;
  subject: string;
  message: string;
  recipientLabel: string;
}

export type ConfirmMessageReplyResult =
  | { ok: true; emailSkipped: boolean; warning?: string }
  | { ok: false; error: string };

function revalidateMessagePaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/messages");
}

export async function prepareMessageReply(messageId: string): Promise<PrepareMessageReplyResult> {
  await assertAdminAccess();

  const repo = await getMessagesRepository();
  const messages = await repo.listContactMessages();
  const message = messages.find((entry) => entry.id === messageId);

  if (!message) {
    throw new Error("Message introuvable.");
  }

  const content = buildContactReplyContent(message.firstName);

  return {
    recipient: message.email,
    subject: content.subject,
    message: content.message,
    recipientLabel: `${message.firstName} ${message.lastName}`.trim(),
  };
}

export async function confirmMessageReply(input: {
  messageId: string;
  subject: string;
  message: string;
}): Promise<ConfirmMessageReplyResult> {
  await assertAdminAccess();

  const repo = await getMessagesRepository();
  const messages = await repo.listContactMessages();
  const contactMessage = messages.find((entry) => entry.id === input.messageId);

  if (!contactMessage) {
    return { ok: false, error: "Message introuvable." };
  }

  const recipient = contactMessage.email.trim();
  const subject = input.subject.trim();
  const message = input.message.trim();

  if (!recipient || !subject || !message) {
    return { ok: false, error: "Destinataire, objet et message sont requis." };
  }

  const eventId = await logDecisionEmailAttempt({
    type: "contact.reply",
    status: "pending",
    payload: {
      recipient,
      subject,
      entityType: "contact_message",
      entityId: input.messageId,
      newStatus: "answered",
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

  await repo.updateMessageStatus(input.messageId, "answered");

  if (sendResult.skipped) {
    await updateDecisionEmailLogStatus(eventId, "skipped", {
      provider: "stub",
      error: "provider_not_configured",
    });
    revalidateMessagePaths();
    return {
      ok: true,
      emailSkipped: true,
      warning: "Fournisseur email non configuré — statut mis à jour, email enregistré uniquement.",
    };
  }

  await updateDecisionEmailLogStatus(eventId, "sent", { error: null });
  revalidateMessagePaths();

  return { ok: true, emailSkipped: false };
}
