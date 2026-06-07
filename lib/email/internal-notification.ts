import {
  getEmailFrom,
  getEmailNotificationTo,
  getEmailProvider,
  isEmailEnabled,
} from "@/lib/email/env";
import { sendTransactionalEmail } from "@/lib/email/transport";
import { getEmailPublicBaseUrl } from "@/lib/site-url";

export type InternalNotificationKind = "contact" | "devis" | "preinscription";

export interface InternalNotificationDetail {
  label: string;
  value: string;
}

export interface SendInternalFormNotificationInput {
  kind: InternalNotificationKind;
  referenceId: string;
  adminPath: string;
  replyToEmail?: string;
  details: InternalNotificationDetail[];
  submittedAt?: Date;
}

const KIND_LABELS: Record<InternalNotificationKind, string> = {
  contact: "Message de contact",
  devis: "Demande de devis",
  preinscription: "Pré-inscription",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatSubmittedAt(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(date);
}

function buildSubject(input: SendInternalFormNotificationInput): string {
  const nameDetail = input.details.find((detail) => detail.label === "Nom");
  const nameSuffix = nameDetail?.value ? ` — ${nameDetail.value}` : "";
  return `[LT Protect] Nouvelle ${KIND_LABELS[input.kind].toLowerCase()}${nameSuffix}`;
}

function buildContent(input: SendInternalFormNotificationInput): { html: string; text: string } {
  const submittedAt = formatSubmittedAt(input.submittedAt ?? new Date());
  const adminUrl = `${getEmailPublicBaseUrl()}${input.adminPath}`;

  const textLines = [
    `Nouvelle demande : ${KIND_LABELS[input.kind]}`,
    `Référence : ${input.referenceId}`,
    `Date : ${submittedAt}`,
    "",
    ...input.details.map((detail) => `${detail.label} : ${detail.value}`),
    "",
    `Voir dans l'admin : ${adminUrl}`,
  ];

  const detailRows = input.details
    .map(
      (detail) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #e8ecf2;font-weight:600;color:#0b1f3a;vertical-align:top;white-space:nowrap;">${escapeHtml(detail.label)}</td><td style="padding:8px 12px;border-bottom:1px solid #e8ecf2;color:#2d3748;">${escapeHtml(detail.value).replace(/\n/g, "<br/>")}</td></tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="fr">
<body style="margin:0;padding:24px;font-family:Arial,Helvetica,sans-serif;background:#f4f6fa;color:#2d3748;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
    <div style="padding:20px 24px;background:#0b1f3a;color:#ffffff;">
      <p style="margin:0 0 4px;font-size:13px;opacity:0.85;">Notification interne</p>
      <h1 style="margin:0;font-size:20px;font-weight:700;">${escapeHtml(KIND_LABELS[input.kind])}</h1>
    </div>
    <div style="padding:24px;">
      <p style="margin:0 0 16px;font-size:14px;line-height:1.6;">
        <strong>Référence :</strong> ${escapeHtml(input.referenceId)}<br/>
        <strong>Date :</strong> ${escapeHtml(submittedAt)}
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.5;">
        <tbody>${detailRows}</tbody>
      </table>
      <p style="margin:24px 0 0;">
        <a href="${escapeHtml(adminUrl)}" style="display:inline-block;padding:10px 16px;background:#1d5eb0;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;">Ouvrir dans l'admin</a>
      </p>
    </div>
  </div>
</body>
</html>`;

  return { html, text: textLines.join("\n") };
}

/**
 * Sends an internal alert to the team inbox. Failures are logged only — never block form saves.
 */
export async function sendInternalFormNotification(
  input: SendInternalFormNotificationInput,
): Promise<{ ok: true; skipped?: boolean } | { ok: false; error: string }> {
  const to = getEmailNotificationTo();
  const subject = buildSubject(input);
  const content = buildContent(input);

  if (!isEmailEnabled()) {
    console.info("[email:internal-notification:stub]", {
      to,
      subject,
      from: getEmailFrom() || null,
      provider: getEmailProvider(),
      referenceId: input.referenceId,
      kind: input.kind,
      text: content.text,
    });
    return { ok: true, skipped: true };
  }

  const sendResult = await sendTransactionalEmail({
    to,
    subject,
    html: content.html,
    text: content.text,
    replyTo: input.replyToEmail,
  });

  if (!sendResult.ok) {
    console.error("[email:internal-notification]", sendResult.error, {
      referenceId: input.referenceId,
      kind: input.kind,
    });
    return { ok: false, error: sendResult.error };
  }

  console.info("[email:internal-notification:sent]", {
    to,
    subject,
    referenceId: input.referenceId,
    kind: input.kind,
    provider: sendResult.provider,
  });

  return { ok: true };
}

/** Fire-and-forget wrapper — form submissions must succeed even if email fails. */
export function notifyTeamOfFormSubmission(input: SendInternalFormNotificationInput): void {
  void sendInternalFormNotification(input).catch((error) => {
    console.error("[email:internal-notification:unhandled]", error, {
      referenceId: input.referenceId,
      kind: input.kind,
    });
  });
}
