export function isRealDataEnabled(): boolean {
  return (
    process.env.USE_REAL_DATA === "true" &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

export function isSupabaseConfigured(): boolean {
  return (
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

/** Real Supabase Auth for /admin — independent of USE_REAL_DATA. */
export function isAdminAuthEnabled(): boolean {
  return process.env.ADMIN_AUTH === "true" && isSupabaseConfigured();
}
