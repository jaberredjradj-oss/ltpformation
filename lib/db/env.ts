import {
  getResolvedSupabasePublishableKey,
  getResolvedSupabaseSecretKey,
  getResolvedSupabaseUrl,
} from "@/lib/db/supabase-env";

function envFlag(name: string): boolean {
  return process.env[name]?.trim() === "true";
}

export function isRealDataEnabled(): boolean {
  return envFlag("USE_REAL_DATA") && Boolean(getResolvedSupabaseSecretKey());
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getResolvedSupabasePublishableKey());
}

/** Real Supabase Auth for /admin — independent of USE_REAL_DATA. */
export function isAdminAuthEnabled(): boolean {
  return envFlag("ADMIN_AUTH") && isSupabaseConfigured();
}
