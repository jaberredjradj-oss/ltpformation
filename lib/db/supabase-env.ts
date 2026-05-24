import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { verifySupabaseKeyViaRest } from "@/lib/db/supabase-rest-verify";
import { withUploadTimeout } from "@/lib/documents/upload-timeout";

export type SupabaseKeyKind =
  | "publishable"
  | "secret"
  | "legacy-anon"
  | "legacy-service"
  | "invalid";

export type SupabaseConnectivityStatus = "unknown" | "valid" | "invalid";

export interface SupabaseEnvSnapshot {
  checkedAt: string;
  useRealDataRequested: boolean;
  adminAuthRequested: boolean;
  url: string | null;
  publishableKey: string | null;
  secretKey: string | null;
  urlIssues: string[];
  publishableIssues: string[];
  secretIssues: string[];
  publishableConnectivity: SupabaseConnectivityStatus;
  secretConnectivity: SupabaseConnectivityStatus;
  publishableError: string | null;
  secretError: string | null;
}

interface SupabaseEnvCache {
  checkedAt: string;
  url: string | null;
  publishableFingerprint: string | null;
  secretFingerprint: string | null;
  publishableValid: boolean;
  secretValid: boolean;
  publishableError: string | null;
  secretError: string | null;
}

const ENV_CACHE_PATH = path.join(process.cwd(), ".data", "supabase-env.json");
const LOG_PREFIX = "[supabase:env]";

let memorySnapshot: SupabaseEnvSnapshot | null = null;
let validationPromise: Promise<SupabaseEnvSnapshot> | null = null;

const SUPABASE_URL_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_URL",
] as const;

const PUBLISHABLE_KEY_VARS = [
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_PUBLISHABLE_KEY",
] as const;

const SECRET_KEY_VARS = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_SECRET_KEY",
] as const;

export function sanitizeEnvValue(raw: string | undefined): string | undefined {
  if (raw === undefined) return undefined;

  let value = raw.trim();
  if (!value) return undefined;

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }

  value = value.replace(/^\uFEFF/, "");
  return value || undefined;
}

function readProcessEnv(name: string): string | undefined {
  return sanitizeEnvValue(process.env[name]);
}

function pickFirstEnv(names: readonly string[]): string | undefined {
  for (const name of names) {
    const value = readProcessEnv(name);
    if (value) return value;
  }
  return undefined;
}

export function detectSupabaseKeyKind(key: string): SupabaseKeyKind {
  if (key.startsWith("sb_publishable_")) return "publishable";
  if (key.startsWith("sb_secret_")) return "secret";
  if (key.startsWith("eyJ") && key.split(".").length === 3) return "legacy-anon";
  return "invalid";
}

function isLegacyJwt(key: string): boolean {
  return key.startsWith("eyJ") && key.split(".").length === 3;
}

function validateSupabaseUrl(url: string | undefined): string[] {
  if (!url) return ["Missing Supabase project URL."];

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return ["Supabase URL must use http(s)."];
    }
    if (!parsed.hostname.endsWith(".supabase.co")) {
      return ["Supabase URL should end with .supabase.co."];
    }
  } catch {
    return ["Supabase URL is not a valid URL."];
  }

  return [];
}

function validatePublishableKey(key: string | undefined): string[] {
  if (!key) return ["Missing publishable/anon key."];

  const kind = detectSupabaseKeyKind(key);
  if (kind === "secret") {
    return ["Publishable slot contains a secret key (sb_secret_...). Use sb_publishable_... here."];
  }
  if (kind === "invalid" && !isLegacyJwt(key)) {
    return ["Publishable key format is invalid (expected sb_publishable_... or legacy JWT)."];
  }
  if (key.length < 30) {
    return ["Publishable key looks truncated."];
  }

  return [];
}

function validateSecretKey(key: string | undefined): string[] {
  if (!key) return ["Missing secret/service role key."];

  const kind = detectSupabaseKeyKind(key);
  if (kind === "publishable") {
    return ["Secret slot contains a publishable key (sb_publishable_...). Use sb_secret_... here."];
  }
  if (kind === "invalid" && !isLegacyJwt(key)) {
    return ["Secret key format is invalid (expected sb_secret_... or legacy service_role JWT)."];
  }
  if (key.length < 30) {
    return ["Secret key looks truncated."];
  }

  return [];
}

export function maskSupabaseKey(key: string | null | undefined): string {
  if (!key) return "(missing)";
  if (key.length <= 12) return "***";
  return `${key.slice(0, 12)}...${key.slice(-4)} (${key.length} chars)`;
}

function keyFingerprint(key: string | null | undefined): string | null {
  if (!key) return null;
  return `${key.slice(0, 16)}:${key.length}:${key.slice(-6)}`;
}

function readEnvCache(): SupabaseEnvCache | null {
  try {
    const raw = readFileSync(ENV_CACHE_PATH, "utf8");
    return JSON.parse(raw) as SupabaseEnvCache;
  } catch {
    return null;
  }
}

function writeEnvCache(cache: SupabaseEnvCache): void {
  try {
    mkdirSync(path.dirname(ENV_CACHE_PATH), { recursive: true });
    writeFileSync(ENV_CACHE_PATH, JSON.stringify(cache, null, 2), "utf8");
  } catch (error) {
    console.warn(
      `${LOG_PREFIX} Could not write env cache:`,
      error instanceof Error ? error.message : error,
    );
  }
}

function resolveConnectivityFromCache(
  url: string | null,
  publishableKey: string | null,
  secretKey: string | null,
): Pick<
  SupabaseEnvSnapshot,
  | "publishableConnectivity"
  | "secretConnectivity"
  | "publishableError"
  | "secretError"
> {
  const cache = readEnvCache();
  if (!cache) {
    return {
      publishableConnectivity: "unknown",
      secretConnectivity: "unknown",
      publishableError: null,
      secretError: null,
    };
  }

  const publishableMatch =
    cache.url === url &&
    cache.publishableFingerprint === keyFingerprint(publishableKey);
  const secretMatch =
    cache.url === url && cache.secretFingerprint === keyFingerprint(secretKey);

  return {
    publishableConnectivity: publishableMatch
      ? cache.publishableValid
        ? "valid"
        : "invalid"
      : "unknown",
    secretConnectivity: secretMatch
      ? cache.secretValid
        ? "valid"
        : "invalid"
      : "unknown",
    publishableError: publishableMatch ? cache.publishableError : null,
    secretError: secretMatch ? cache.secretError : null,
  };
}

export function resolveSupabaseEnv(): {
  url: string | null;
  publishableKey: string | null;
  secretKey: string | null;
  urlIssues: string[];
  publishableIssues: string[];
  secretIssues: string[];
} {
  const url = pickFirstEnv(SUPABASE_URL_VARS) ?? null;
  const publishableKey = pickFirstEnv(PUBLISHABLE_KEY_VARS) ?? null;
  const secretKey = pickFirstEnv(SECRET_KEY_VARS) ?? null;

  return {
    url,
    publishableKey,
    secretKey,
    urlIssues: validateSupabaseUrl(url ?? undefined),
    publishableIssues: validatePublishableKey(publishableKey ?? undefined),
    secretIssues: validateSecretKey(secretKey ?? undefined),
  };
}

export async function verifySupabaseConnectivity(
  url: string,
  key: string,
): Promise<{ ok: boolean; error: string | null }> {
  return withUploadTimeout(
    verifySupabaseKeyViaRest(url, key),
    8000,
    "Supabase env verification",
  );
}

function logSnapshot(snapshot: SupabaseEnvSnapshot): void {
  console.info(`${LOG_PREFIX} Environment check (${snapshot.checkedAt})`);
  console.info(`${LOG_PREFIX} URL: ${snapshot.url ?? "(missing)"}`);
  console.info(
    `${LOG_PREFIX} Publishable key: ${maskSupabaseKey(snapshot.publishableKey)} -> ${snapshot.publishableConnectivity}`,
  );
  console.info(
    `${LOG_PREFIX} Secret key: ${maskSupabaseKey(snapshot.secretKey)} -> ${snapshot.secretConnectivity}`,
  );

  for (const issue of snapshot.urlIssues) console.warn(`${LOG_PREFIX} URL issue: ${issue}`);
  for (const issue of snapshot.publishableIssues) {
    console.warn(`${LOG_PREFIX} Publishable key issue: ${issue}`);
  }
  for (const issue of snapshot.secretIssues) {
    console.warn(`${LOG_PREFIX} Secret key issue: ${issue}`);
  }
  if (snapshot.publishableError) {
    console.warn(`${LOG_PREFIX} Publishable connectivity error: ${snapshot.publishableError}`);
  }
  if (snapshot.secretError) {
    console.warn(`${LOG_PREFIX} Secret connectivity error: ${snapshot.secretError}`);
  }

  if (snapshot.useRealDataRequested && snapshot.secretConnectivity === "invalid") {
    console.warn(
      `${LOG_PREFIX} USE_REAL_DATA=true but secret key is invalid. Falling back to demo/static data.`,
    );
  }

  if (snapshot.adminAuthRequested && snapshot.publishableConnectivity === "invalid") {
    console.warn(
      `${LOG_PREFIX} ADMIN_AUTH=true but publishable key is invalid. Admin login will not work.`,
    );
  }
}

export async function validateSupabaseEnvironment(options?: {
  log?: boolean;
}): Promise<SupabaseEnvSnapshot> {
  const resolved = resolveSupabaseEnv();
  const cached = resolveConnectivityFromCache(
    resolved.url,
    resolved.publishableKey,
    resolved.secretKey,
  );

  let publishableConnectivity = cached.publishableConnectivity;
  let secretConnectivity = cached.secretConnectivity;
  let publishableError = cached.publishableError;
  let secretError = cached.secretError;

  if (
    resolved.url &&
    resolved.publishableKey &&
    resolved.publishableIssues.length === 0 &&
    publishableConnectivity === "unknown"
  ) {
    const result = await verifySupabaseConnectivity(resolved.url, resolved.publishableKey);
    publishableConnectivity = result.ok ? "valid" : "invalid";
    publishableError = result.error;
  } else if (resolved.publishableIssues.length > 0) {
    publishableConnectivity = "invalid";
  }

  if (
    resolved.url &&
    resolved.secretKey &&
    resolved.secretIssues.length === 0 &&
    secretConnectivity === "unknown"
  ) {
    const result = await verifySupabaseConnectivity(resolved.url, resolved.secretKey);
    secretConnectivity = result.ok ? "valid" : "invalid";
    secretError = result.error;
  } else if (resolved.secretIssues.length > 0) {
    secretConnectivity = "invalid";
  }

  const snapshot: SupabaseEnvSnapshot = {
    checkedAt: new Date().toISOString(),
    useRealDataRequested: readProcessEnv("USE_REAL_DATA") === "true",
    adminAuthRequested: readProcessEnv("ADMIN_AUTH") === "true",
    url: resolved.url,
    publishableKey: resolved.publishableKey,
    secretKey: resolved.secretKey,
    urlIssues: resolved.urlIssues,
    publishableIssues: resolved.publishableIssues,
    secretIssues: resolved.secretIssues,
    publishableConnectivity,
    secretConnectivity,
    publishableError,
    secretError,
  };

  writeEnvCache({
    checkedAt: snapshot.checkedAt,
    url: snapshot.url,
    publishableFingerprint: keyFingerprint(snapshot.publishableKey),
    secretFingerprint: keyFingerprint(snapshot.secretKey),
    publishableValid: snapshot.publishableConnectivity === "valid",
    secretValid: snapshot.secretConnectivity === "valid",
    publishableError: snapshot.publishableError,
    secretError: snapshot.secretError,
  });

  memorySnapshot = snapshot;
  if (options?.log !== false) logSnapshot(snapshot);
  return snapshot;
}

export function getSupabaseEnvSnapshot(): SupabaseEnvSnapshot | null {
  return memorySnapshot;
}

export function ensureSupabaseEnvironmentValidated(): Promise<SupabaseEnvSnapshot> {
  if (memorySnapshot) return Promise.resolve(memorySnapshot);
  if (!validationPromise) {
    validationPromise = validateSupabaseEnvironment().finally(() => {
      validationPromise = null;
    });
  }
  return validationPromise;
}

function hasValidFormat(
  url: string | null,
  key: string | null,
  issues: string[],
): boolean {
  return Boolean(url && key && issues.length === 0);
}

function isKnownInvalid(
  current: SupabaseConnectivityStatus,
  cached: SupabaseConnectivityStatus,
): boolean {
  if (current === "invalid") return true;
  if (process.env.NEXT_PHASE === "phase-production-build" && cached === "invalid") {
    return true;
  }
  return false;
}

function isKnownValid(
  current: SupabaseConnectivityStatus,
  cached: SupabaseConnectivityStatus,
): boolean {
  return current === "valid" || cached === "valid";
}

export function isSupabasePublishableKeyOperational(): boolean {
  const resolved = resolveSupabaseEnv();
  if (!hasValidFormat(resolved.url, resolved.publishableKey, resolved.publishableIssues)) {
    return false;
  }

  const cached = resolveConnectivityFromCache(
    resolved.url,
    resolved.publishableKey,
    resolved.secretKey,
  );
  const current = memorySnapshot?.publishableConnectivity ?? "unknown";

  if (isKnownInvalid(current, cached.publishableConnectivity)) return false;
  if (isKnownValid(current, cached.publishableConnectivity)) return true;

  return process.env.NEXT_PHASE !== "phase-production-build";
}

export function isSupabaseServerKeyOperational(): boolean {
  const resolved = resolveSupabaseEnv();
  if (!hasValidFormat(resolved.url, resolved.secretKey, resolved.secretIssues)) {
    return false;
  }

  const cached = resolveConnectivityFromCache(
    resolved.url,
    resolved.publishableKey,
    resolved.secretKey,
  );
  const current = memorySnapshot?.secretConnectivity ?? "unknown";

  if (isKnownInvalid(current, cached.secretConnectivity)) return false;
  if (isKnownValid(current, cached.secretConnectivity)) return true;

  return process.env.NEXT_PHASE !== "phase-production-build";
}

export function getResolvedSupabaseUrl(): string | null {
  return resolveSupabaseEnv().url;
}

export function getResolvedSupabasePublishableKey(): string | null {
  const resolved = resolveSupabaseEnv();
  if (!hasValidFormat(resolved.url, resolved.publishableKey, resolved.publishableIssues)) {
    return null;
  }
  if (!isSupabasePublishableKeyOperational()) return null;
  return resolved.publishableKey;
}

export function getResolvedSupabaseSecretKey(): string | null {
  const resolved = resolveSupabaseEnv();
  if (!hasValidFormat(resolved.url, resolved.secretKey, resolved.secretIssues)) {
    return null;
  }
  if (!isSupabaseServerKeyOperational()) return null;
  return resolved.secretKey;
}
