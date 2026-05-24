import { createBrowserClient } from "@supabase/ssr";
import {
  getResolvedSupabasePublishableKey,
  getResolvedSupabaseUrl,
} from "@/lib/db/supabase-env";

export function createSupabaseBrowserClient() {
  const url = getResolvedSupabaseUrl();
  const anonKey = getResolvedSupabasePublishableKey();

  if (!url || !anonKey) {
    throw new Error("Supabase browser client is not configured.");
  }

  return createBrowserClient(url, anonKey);
}
