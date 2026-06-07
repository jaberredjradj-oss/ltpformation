/**
 * Deployment check: reads email/SMTP env vars (no hardcoded credentials).
 *
 * Usage:
 *   npx tsx scripts/verify-email-smtp.ts           # config summary + SMTP verify if configured
 *   npx tsx scripts/verify-email-smtp.ts --config-only
 */
import { readFileSync } from "node:fs";
import nodemailer from "nodemailer";
import {
  getEmailFrom,
  getEmailNotificationTo,
  getEmailProvider,
  getEmailReplyTo,
  getSmtpTransportConfig,
  isEmailEnabled,
} from "../lib/email/env";

function loadEnvLocal(): void {
  try {
    const raw = readFileSync(".env.local", "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // Hosting injects env directly — .env.local is optional.
  }
}

function mask(value: string): string {
  if (!value) return "(empty)";
  if (value.includes("@")) {
    const [local, domain] = value.split("@");
    const visible = local.slice(0, Math.min(2, local.length));
    return `${visible}***@${domain}`;
  }
  return "***set***";
}

function buildSmtpOptions(config: NonNullable<ReturnType<typeof getSmtpTransportConfig>>) {
  const tlsServername = process.env.SMTP_TLS_SERVERNAME?.trim() || config.host;
  return {
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
    tls: { servername: tlsServername },
  };
}

async function main() {
  loadEnvLocal();
  const configOnly = process.argv.includes("--config-only");

  const provider = getEmailProvider();
  const smtp = getSmtpTransportConfig();
  const summary = {
    provider,
    emailEnabled: isEmailEnabled(),
    emailFrom: getEmailFrom(),
    replyTo: getEmailReplyTo(),
    notificationTo: getEmailNotificationTo(),
    emailProviderEnv: process.env.EMAIL_PROVIDER?.trim() || "(auto)",
    smtpHost: smtp?.host ?? null,
    smtpPort: smtp?.port ?? null,
    smtpSecure: smtp?.secure ?? null,
    smtpUser: smtp ? mask(smtp.auth.user) : null,
    smtpPasswordSet: Boolean(smtp?.auth.pass),
    smtpTlsServername: process.env.SMTP_TLS_SERVERNAME?.trim() || smtp?.host || null,
    resendKeySet: Boolean(process.env.RESEND_API_KEY?.trim()),
  };

  console.log("=== Email configuration (secrets masked) ===");
  console.log(JSON.stringify(summary, null, 2));

  const checks: Array<[string, boolean]> = [
    ["EMAIL_FROM is set", Boolean(process.env.EMAIL_FROM?.trim())],
    [
      "Reply-To is contact@ltpformation.fr",
      getEmailReplyTo() === "contact@ltpformation.fr",
    ],
    [
      "Internal notifications target Gmail",
      getEmailNotificationTo() === "ltprotect.formation@gmail.com",
    ],
    [
      "Admin From uses contact@ltpformation.fr",
      getEmailFrom().includes("contact@ltpformation.fr"),
    ],
  ];

  if (provider === "smtp") {
    checks.push(["SMTP host configured", Boolean(smtp?.host)]);
    checks.push(["SMTP user configured", Boolean(smtp?.auth.user)]);
    checks.push(["SMTP password configured", Boolean(smtp?.auth.pass)]);
    checks.push(
      ["O2Switch port 465 uses secure=true", smtp?.port === 465 ? smtp.secure === true : true],
    );
  }

  console.log("\n=== Checks ===");
  let failed = 0;
  for (const [label, ok] of checks) {
    console.log(ok ? "PASS" : "FAIL", label);
    if (!ok) failed += 1;
  }

  if (configOnly) {
    if (failed > 0) process.exit(1);
    return;
  }

  if (provider !== "smtp" || !smtp) {
    console.log("\nSMTP verify skipped (provider is not smtp or SMTP vars missing).");
    if (failed > 0) process.exit(1);
    return;
  }

  console.log("\n=== SMTP connection verify (O2Switch) ===");
  const transporter = nodemailer.createTransport(buildSmtpOptions(smtp));
  try {
    await transporter.verify();
    console.log("PASS SMTP server accepted connection and authentication.");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("FAIL SMTP verify:", message);
    failed += 1;
  }

  if (failed > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
