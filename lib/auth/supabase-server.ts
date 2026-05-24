import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  getResolvedSupabasePublishableKey,
  getResolvedSupabaseUrl,
} from "@/lib/db/supabase-env";

export async function createSupabaseServerClient() {
  const url = getResolvedSupabaseUrl();
  const anonKey = getResolvedSupabasePublishableKey();

  if (!url || !anonKey) {
    throw new Error("Supabase server client is not configured.");
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component — proxy handles refresh.
        }
      },
    },
  });
}
