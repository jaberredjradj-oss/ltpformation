/**
 * Grant admin access to an existing Supabase Auth user.
 *
 * Usage:
 *   1. Create the user in Supabase Auth (Dashboard → Authentication)
 *   2. Run: npm run admin:grant -- user@example.com
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 */
import { createClient } from "@supabase/supabase-js";

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();

  if (!email) {
    console.error("Usage: npm run admin:grant -- user@example.com");
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: users, error: listError } = await client.auth.admin.listUsers();

  if (listError) {
    console.error("Could not list users:", listError.message);
    process.exit(1);
  }

  const user = users.users.find((item) => item.email?.toLowerCase() === email);

  if (!user) {
    console.error(`No auth user found for ${email}. Create the account in Supabase first.`);
    process.exit(1);
  }

  const { error: upsertError } = await client.from("admin_members").upsert(
    {
      user_id: user.id,
      email,
      role: "admin",
      active: true,
    },
    { onConflict: "user_id" },
  );

  if (upsertError) {
    console.error("Grant failed:", upsertError.message);
    process.exit(1);
  }

  console.log(`Admin access granted to ${email} (${user.id}).`);
}

main().catch((error) => {
  console.error("Grant failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
