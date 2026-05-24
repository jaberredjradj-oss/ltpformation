import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isRealDataEnabled } from "@/lib/db/env";
import {
  ensureSupabaseEnvironmentValidated,
  getResolvedSupabaseSecretKey,
  getResolvedSupabaseUrl,
} from "@/lib/db/supabase-env";

let client: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient | null {
  if (!isRealDataEnabled()) {
    return null;
  }

  const url = getResolvedSupabaseUrl();
  const secretKey = getResolvedSupabaseSecretKey();
  if (!url || !secretKey) {
    return null;
  }

  if (!client) {
    client = createClient(url, secretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return client;
}

export async function getSupabaseServerClientAsync(): Promise<SupabaseClient | null> {
  await ensureSupabaseEnvironmentValidated();
  return getSupabaseServerClient();
}
