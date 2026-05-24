import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const ENV_PATH = path.join(ROOT, ".env.local");
const CACHE_PATH = path.join(ROOT, ".data", "supabase-env.json");
const LOG_PREFIX = "[supabase:env:repair]";

const KNOWN_KEYS = new Set([
  "USE_REAL_DATA",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_SECRET_KEY",
  "ADMIN_AUTH",
  "ADMIN_ALLOWED_EMAILS",
  "EMAIL_FROM",
  "EMAIL_FROM_NAME",
  "EMAIL_REPLY_TO",
  "EMAIL_PROVIDER",
  "RESEND_API_KEY",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "NEXT_PUBLIC_SITE_URL",
  "DATABASE_URL",
  "SUPABASE_DB_URL",
  "SUPABASE_DB_PASSWORD",
]);

function sanitizeValue(value) {
  let next = value.trim();
  if (
    (next.startsWith('"') && next.endsWith('"')) ||
    (next.startsWith("'") && next.endsWith("'"))
  ) {
    next = next.slice(1, -1).trim();
  }
  return next.replace(/^\uFEFF/, "");
}

function parseAssignments(raw) {
  const compact = raw.replace(/\r\n/g, "\n");
  const assignments = new Map();

  for (const originalLine of compact.split("\n")) {
    const line = originalLine.trim();
    if (!line || line.startsWith("#")) continue;

    const embedded = line.match(
      /^([A-Z0-9_]+)=(.*?)(?:\s+([A-Z0-9_]+)=([\s\S]*))?$/,
    );

    if (embedded && KNOWN_KEYS.has(embedded[1])) {
      assignments.set(embedded[1], sanitizeValue(embedded[2]));
      if (embedded[3] && KNOWN_KEYS.has(embedded[3])) {
        assignments.set(embedded[3], sanitizeValue(embedded[4]));
      }
      continue;
    }

    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match || !KNOWN_KEYS.has(match[1])) continue;
    assignments.set(match[1], sanitizeValue(match[2]));
  }

  return assignments;
}

function repairEnvFile() {
  let raw = "";
  try {
    raw = readFileSync(ENV_PATH, "utf8");
  } catch {
    console.info(`${LOG_PREFIX} No .env.local file found — skipping repair.`);
    return null;
  }

  const assignments = parseAssignments(raw);
  if (assignments.size === 0) {
    console.warn(`${LOG_PREFIX} No recognized env assignments found in .env.local.`);
    return null;
  }

  const orderedKeys = [
    "USE_REAL_DATA",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "ADMIN_AUTH",
    "ADMIN_ALLOWED_EMAILS",
    "EMAIL_FROM",
    "EMAIL_FROM_NAME",
    "EMAIL_REPLY_TO",
    "EMAIL_PROVIDER",
    "RESEND_API_KEY",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_SECURE",
    "SMTP_USER",
    "SMTP_PASSWORD",
    "NEXT_PUBLIC_SITE_URL",
    "DATABASE_URL",
    "SUPABASE_DB_URL",
    "SUPABASE_DB_PASSWORD",
  ];

  const lines = [];
  for (const key of orderedKeys) {
    if (!assignments.has(key)) continue;
    lines.push(`${key}=${assignments.get(key)}`);
    assignments.delete(key);
  }

  for (const [key, value] of assignments.entries()) {
    lines.push(`${key}=${value}`);
  }

  const nextRaw = `${lines.join("\n")}\n`;
  if (nextRaw !== raw.replace(/\r\n/g, "\n")) {
    writeFileSync(ENV_PATH, nextRaw, "utf8");
    console.info(`${LOG_PREFIX} Repaired .env.local formatting.`);
  } else {
    console.info(`${LOG_PREFIX} .env.local formatting already valid.`);
  }

  for (const [key, value] of parseAssignments(nextRaw).entries()) {
    process.env[key] = value;
  }

  return nextRaw;
}

function pickEnv(names) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return null;
}

function keyFingerprint(key) {
  if (!key) return null;
  return `${key.slice(0, 16)}:${key.length}:${key.slice(-6)}`;
}

async function verify(url, key) {
  const client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await client.from("planning_sessions").select("id").limit(1);
  if (!error) return { ok: true, error: null };

  const message = error.message ?? "Unknown Supabase error.";
  const lower = message.toLowerCase();
  if (
    lower.includes("invalid api key") ||
    lower.includes("invalid compact jws") ||
    lower.includes("jwt")
  ) {
    return { ok: false, error: message };
  }

  return { ok: true, error: null };
}

async function validateAndCache() {
  const url = pickEnv(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL"]);
  const publishableKey = pickEnv([
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_PUBLISHABLE_KEY",
  ]);
  const secretKey = pickEnv(["SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEY"]);

  if (!url) {
    console.warn(`${LOG_PREFIX} Missing Supabase URL.`);
    return;
  }

  let publishableValid = false;
  let secretValid = false;
  let publishableError = null;
  let secretError = null;

  if (publishableKey) {
    const result = await verify(url, publishableKey);
    publishableValid = result.ok;
    publishableError = result.error;
    console.info(
      `${LOG_PREFIX} Publishable key check: ${result.ok ? "OK" : `FAILED (${result.error})`}`,
    );
  } else {
    console.warn(`${LOG_PREFIX} Missing publishable/anon key.`);
  }

  if (secretKey) {
    const result = await verify(url, secretKey);
    secretValid = result.ok;
    secretError = result.error;
    console.info(
      `${LOG_PREFIX} Secret key check: ${result.ok ? "OK" : `FAILED (${result.error})`}`,
    );
  } else {
    console.warn(`${LOG_PREFIX} Missing secret/service role key.`);
  }

  mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
  writeFileSync(
    CACHE_PATH,
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        url,
        publishableFingerprint: keyFingerprint(publishableKey),
        secretFingerprint: keyFingerprint(secretKey),
        publishableValid,
        secretValid,
        publishableError,
        secretError,
      },
      null,
      2,
    ),
    "utf8",
  );
}

repairEnvFile();
await validateAndCache();
