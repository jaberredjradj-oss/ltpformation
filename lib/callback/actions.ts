"use server";

import { revalidatePath } from "next/cache";
import type { CallbackFormSource, CallbackFormValues } from "@/lib/callback/types";
import {
  hasCallbackValidationErrors,
  validateCallbackForm,
} from "@/lib/callback/validation";
import { notifyTeamOfFormSubmission } from "@/lib/email/internal-notification";
import { getMessagesRepository } from "@/lib/repositories";
import { notificationDispatcher } from "@/lib/notifications/dispatcher";
import { isLikelySpam } from "@/lib/registration/antispam";

export interface CallbackSubmitPayload {
  values: CallbackFormValues;
  source: CallbackFormSource;
  honeypot: string;
  formLoadedAt: number;
}

export type CallbackSubmitResult =
  | { ok: true; submissionId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const SOURCE_LABELS: Record<CallbackFormSource, string> = {
  rappel: "Landing page rappel (Ads)",
  contact: "Page contact",
  formation: "Page formation",
};

function createSubmissionId(): string {
  return `callback-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildCallbackMessage(values: CallbackFormValues, source: CallbackFormSource): string {
  const company = values.company.trim();
  const lines = [
    "Demande de rappel téléphonique",
    `Source : ${SOURCE_LABELS[source]}`,
    company ? `Entreprise : ${company}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}

export async function submitCallbackForm(
  payload: CallbackSubmitPayload,
): Promise<CallbackSubmitResult> {
  if (isLikelySpam({ honeypot: payload.honeypot, formLoadedAt: payload.formLoadedAt })) {
    return { ok: true, submissionId: createSubmissionId() };
  }

  const fieldErrors = validateCallbackForm(payload.values) as Record<string, string>;

  if (hasCallbackValidationErrors(fieldErrors)) {
    return {
      ok: false,
      error: "Certains champs sont invalides.",
      fieldErrors,
    };
  }

  const messagesRepo = await getMessagesRepository();
  const message = buildCallbackMessage(payload.values, payload.source);

  try {
    const { id } = await messagesRepo.createMessage({
      firstName: payload.values.firstName.trim(),
      lastName: payload.values.lastName.trim(),
      email: payload.values.email.trim(),
      phone: payload.values.phone.trim(),
      message,
    });

    await notificationDispatcher.dispatch({
      type: "contact.created",
      payload: { id },
    });

    notifyTeamOfFormSubmission({
      kind: "callback",
      referenceId: id,
      adminPath: "/admin/messages",
      replyToEmail: payload.values.email.trim(),
      details: [
        {
          label: "Nom",
          value: `${payload.values.firstName.trim()} ${payload.values.lastName.trim()}`.trim(),
        },
        { label: "Email", value: payload.values.email.trim() },
        { label: "Téléphone", value: payload.values.phone.trim() },
        { label: "Entreprise", value: payload.values.company.trim() || "—" },
        { label: "Source", value: SOURCE_LABELS[payload.source] },
      ],
    });

    revalidatePath("/admin");
    revalidatePath("/admin/messages");

    return { ok: true, submissionId: id };
  } catch (error) {
    console.error("[callback:submit]", error);
    return { ok: false, error: "Enregistrement impossible pour le moment." };
  }
}
