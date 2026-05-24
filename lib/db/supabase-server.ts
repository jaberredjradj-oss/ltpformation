import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isRealDataEnabled } from "@/lib/db/env";
import { SUPABASE_SERVER_CLIENT_OPTIONS } from "@/lib/db/supabase-client-options";
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
    client = createClient(url, secretKey, SUPABASE_SERVER_CLIENT_OPTIONS);
  }

  return client;
}

export async function getSupabaseServerClientAsync(): Promise<SupabaseClient | null> {
  await ensureSupabaseEnvironmentValidated();
  return getSupabaseServerClient();
}
