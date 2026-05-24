/**
 * Verifies contact_messages insert + list (run: node scripts/verify-contact-flow.mjs)
 * Loads .env.local from project root.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (process.env.USE_REAL_DATA !== "true" || !url || !key) {
  console.error("USE_REAL_DATA, Supabase URL and service role key are required.");
  process.exit(1);
}

const client = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const now = new Date().toISOString();
const testEmail = `contact-flow-test-${Date.now()}@example.com`;

const { data: inserted, error: insertError } = await client
  .from("contact_messages")
  .insert({
    first_name: "Flow",
    last_name: "Test",
    email: testEmail,
    phone: null,
    message: "Verification message from verify-contact-flow script",
    status: "unread",
    submitted_at: now,
    updated_at: now,
  })
  .select("id, status, submitted_at")
  .single();

if (insertError) {
  console.error("INSERT failed:", insertError);
  process.exit(1);
}

const { data: rows, error: listError } = await client
  .from("contact_messages")
  .select("id, email, status, submitted_at")
  .eq("id", inserted.id);

if (listError || !rows?.length) {
  console.error("LIST failed:", listError);
  process.exit(1);
}

const { count } = await client
  .from("contact_messages")
  .select("id", { count: "exact", head: true })
  .eq("status", "unread");

console.log("OK insert id:", inserted.id);
console.log("OK status:", inserted.status, "submitted_at:", inserted.submitted_at);
console.log("OK listed row email:", rows[0].email);
console.log("OK unread count (all rows):", count);

await client.from("contact_messages").delete().eq("id", inserted.id);
console.log("Cleanup done.");
