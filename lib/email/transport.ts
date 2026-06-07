import nodemailer from "nodemailer";
import { Resend } from "resend";
import {
  getEmailFrom,
  getEmailProvider,
  getEmailReplyTo,
  getSmtpTransportConfig,
} from "@/lib/email/env";

export interface TransactionalEmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Overrides default Reply-To (admin outgoing emails use contact@ltpformation.fr). */
  replyTo?: string;
}

export type SendTransactionalEmailResult =
  | { ok: true; provider: "resend" | "smtp" }
  | { ok: false; error: string };

async function sendViaResend(
  payload: TransactionalEmailPayload,
  from: string,
  replyTo: string,
): Promise<SendTransactionalEmailResult> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
    replyTo,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, provider: "resend" };
}

async function sendViaSmtp(
  payload: TransactionalEmailPayload,
  from: string,
  replyTo: string,
): Promise<SendTransactionalEmailResult> {
  const config = getSmtpTransportConfig();
  if (!config) {
    return { ok: false, error: "SMTP is not configured." };
  }

  const transporter = nodemailer.createTransport(config);

  try {
    await transporter.sendMail({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      replyTo,
    });
    return { ok: true, provider: "smtp" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "SMTP send failed.";
    return { ok: false, error: message };
  }
}

export async function sendTransactionalEmail(
  payload: TransactionalEmailPayload,
): Promise<SendTransactionalEmailResult> {
  const provider = getEmailProvider();
  const from = getEmailFrom();
  const replyTo = payload.replyTo ?? getEmailReplyTo();

  if (provider === "stub" || !from) {
    return { ok: false, error: "Email provider is not configured." };
  }

  if (provider === "resend") {
    return sendViaResend(payload, from, replyTo);
  }

  return sendViaSmtp(payload, from, replyTo);
}
