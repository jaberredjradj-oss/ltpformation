import { getEmailFrom, getEmailProvider, getEmailReplyTo, isEmailEnabled } from "@/lib/email/env";
import { embedInlineEmailLogo } from "@/lib/email/logo-data-uri.server";
import { buildBrandedEmail } from "@/lib/email/layout";
import { sendTransactionalEmail } from "@/lib/email/transport";
import type {
  SendBrandedAdminEmailInput,
  SendBrandedAdminEmailResult,
} from "@/lib/email/types";

/**
 * Sends an admin email (pré-inscription, devis, contact reply) with the shared
 * branded HTML layout and plain-text fallback. Preview uses buildBrandedEmail().
 */
export async function sendBrandedAdminEmail(
  input: SendBrandedAdminEmailInput,
): Promise<SendBrandedAdminEmailResult> {
  const branded = buildBrandedEmail(input.message);
  const html = embedInlineEmailLogo(branded.html);

  if (!isEmailEnabled()) {
    console.info("[email:stub]", {
      to: input.to,
      subject: input.subject,
      from: getEmailFrom() || null,
      replyTo: getEmailReplyTo(),
      provider: getEmailProvider(),
      message: input.message,
      text: branded.text,
    });
    return { ok: true, skipped: true };
  }

  const sendResult = await sendTransactionalEmail({
    to: input.to,
    subject: input.subject,
    html,
    text: branded.text,
  });

  if (!sendResult.ok) {
    console.error("[email:send]", sendResult.error);
    return { ok: false, error: sendResult.error };
  }

  console.info("[email:sent]", {
    to: input.to,
    subject: input.subject,
    from: getEmailFrom(),
    replyTo: getEmailReplyTo(),
    provider: sendResult.provider,
  });

  return { ok: true, skipped: false };
}

/** @deprecated Use sendBrandedAdminEmail */
export const sendDecisionEmail = sendBrandedAdminEmail;
