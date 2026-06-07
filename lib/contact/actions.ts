"use server";

import { revalidatePath } from "next/cache";
import { isLikelySpam } from "@/lib/registration/antispam";
import type { ContactFormValues } from "@/lib/contact/types";
import {
  hasContactValidationErrors,
  validateContactForm,
} from "@/lib/contact/validation";
import { notifyTeamOfFormSubmission } from "@/lib/email/internal-notification";
import { getMessagesRepository } from "@/lib/repositories";
import { notificationDispatcher } from "@/lib/notifications/dispatcher";

export interface ContactSubmitPayload {
  values: ContactFormValues;
  honeypot: string;
  formLoadedAt: number;
}

export type ContactSubmitResult =
  | { ok: true; submissionId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function createSubmissionId(): string {
  return `contact-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function submitContactForm(
  payload: ContactSubmitPayload,
): Promise<ContactSubmitResult> {
  if (isLikelySpam({ honeypot: payload.honeypot, formLoadedAt: payload.formLoadedAt })) {
    return { ok: true, submissionId: createSubmissionId() };
  }

  const fieldErrors = validateContactForm(payload.values) as Record<string, string>;

  if (hasContactValidationErrors(fieldErrors)) {
    return {
      ok: false,
      error: "Certains champs sont invalides.",
      fieldErrors,
    };
  }

  const messagesRepo = await getMessagesRepository();

  try {
    const { id } = await messagesRepo.createMessage({
      firstName: payload.values.firstName.trim(),
      lastName: payload.values.lastName.trim(),
      email: payload.values.email.trim(),
      phone: payload.values.phone.trim() || null,
      message: payload.values.message.trim(),
    });

    await notificationDispatcher.dispatch({
      type: "contact.created",
      payload: { id },
    });

    notifyTeamOfFormSubmission({
      kind: "contact",
      referenceId: id,
      adminPath: "/admin/messages",
      replyToEmail: payload.values.email.trim(),
      details: [
        { label: "Nom", value: `${payload.values.firstName.trim()} ${payload.values.lastName.trim()}`.trim() },
        { label: "Email", value: payload.values.email.trim() },
        { label: "Téléphone", value: payload.values.phone.trim() || "—" },
        { label: "Message", value: payload.values.message.trim() },
      ],
    });

    revalidatePath("/admin");
    revalidatePath("/admin/messages");

    return { ok: true, submissionId: id };
  } catch (error) {
    console.error("[contact:submit]", error);
    return { ok: false, error: "Enregistrement impossible pour le moment." };
  }
}
