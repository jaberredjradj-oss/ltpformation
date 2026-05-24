/**
 * Edge/proxy-safe Supabase env reads.
 * No filesystem access — safe for proxy.ts and other edge bundles.
 */

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export function getPublicSupabaseUrl(): string | null {
  return readEnv("NEXT_PUBLIC_SUPABASE_URL") ?? readEnv("SUPABASE_URL") ?? null;
}

export function getPublicSupabasePublishableKey(): string | null {
  return (
    readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ??
    readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ??
    readEnv("SUPABASE_PUBLISHABLE_KEY") ??
    null
  );
}

export function isPublicAdminAuthEnabled(): boolean {
  return (
    readEnv("ADMIN_AUTH") === "true" &&
    Boolean(getPublicSupabaseUrl() && getPublicSupabasePublishableKey())
  );
}
