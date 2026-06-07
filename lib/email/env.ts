import { SITE } from "@/lib/constants";

export type EmailProvider = "resend" | "smtp" | "stub";

function trimEnv(value: string | undefined): string {
  return value?.trim() ?? "";
}

function isSmtpConfigured(): boolean {
  return (
    Boolean(trimEnv(process.env.SMTP_HOST)) &&
    Boolean(trimEnv(process.env.SMTP_USER)) &&
    Boolean(trimEnv(process.env.SMTP_PASSWORD))
  );
}

function isResendConfigured(): boolean {
  return Boolean(trimEnv(process.env.RESEND_API_KEY));
}

function isProviderConfigured(provider: Exclude<EmailProvider, "stub">): boolean {
  return provider === "resend" ? isResendConfigured() : isSmtpConfigured();
}

/**
 * Resolves the active email provider.
 * EMAIL_PROVIDER can force "resend" or "smtp"; otherwise auto-detects (Resend first, then SMTP).
 */
export function getEmailProvider(): EmailProvider {
  const forced = trimEnv(process.env.EMAIL_PROVIDER).toLowerCase();

  if (forced === "resend" || forced === "smtp") {
    return isProviderConfigured(forced) ? forced : "stub";
  }

  if (isResendConfigured()) return "resend";
  if (isSmtpConfigured()) return "smtp";
  return "stub";
}

export function isEmailEnabled(): boolean {
  return getEmailProvider() !== "stub" && Boolean(getEmailFrom());
}

/**
 * RFC 5322 From header, e.g. "LT Protect Formation <contact@ltpformation.fr>".
 * Set EMAIL_FROM to the address or full formatted value; optional EMAIL_FROM_NAME when using address only.
 */
export function getEmailFrom(): string {
  const from = trimEnv(process.env.EMAIL_FROM);
  if (!from) return "";

  const name = trimEnv(process.env.EMAIL_FROM_NAME);
  if (name && !from.includes("<")) {
    return `${name} <${from}>`;
  }

  return from;
}

/**
 * Internal notification inbox (form alerts, reply routing). Not shown on the public site.
 */
export function getEmailNotificationTo(): string {
  const configured = trimEnv(process.env.EMAIL_NOTIFICATION_TO);
  if (configured) return configured;

  return SITE.notificationEmail;
}

/**
 * Reply-To for visitor-facing admin emails (defaults to the public contact address).
 */
export function getEmailReplyTo(): string {
  const replyTo = trimEnv(process.env.EMAIL_REPLY_TO);
  if (replyTo) return replyTo;

  return SITE.email;
}

export interface SmtpTransportConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export function getSmtpTransportConfig(): SmtpTransportConfig | null {
  const host = trimEnv(process.env.SMTP_HOST);
  const user = trimEnv(process.env.SMTP_USER);
  const pass = trimEnv(process.env.SMTP_PASSWORD);

  if (!host || !user || !pass) return null;

  const port = Number.parseInt(trimEnv(process.env.SMTP_PORT) || "587", 10);
  const secure =
    trimEnv(process.env.SMTP_SECURE).toLowerCase() === "true" || port === 465;

  return {
    host,
    port: Number.isFinite(port) ? port : 587,
    secure,
    auth: { user, pass },
  };
}
