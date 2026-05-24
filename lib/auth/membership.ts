import type { User } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import type { AdminRole } from "@/lib/auth/types";

function parseAllowedEmails(): string[] {
  return (
    process.env.ADMIN_ALLOWED_EMAILS?.split(",").map((email) => email.trim().toLowerCase()) ??
    []
  ).filter(Boolean);
}

function roleFromUser(user: User): AdminRole {
  const role = user.app_metadata?.role;
  return role === "editor" ? "editor" : "admin";
}

export async function resolveAdminRole(user: User): Promise<AdminRole | null> {
  if (user.app_metadata?.role === "admin" || user.app_metadata?.role === "editor") {
    return roleFromUser(user);
  }

  const allowedEmails = parseAllowedEmails();
  if (allowedEmails.includes(user.email?.toLowerCase() ?? "")) {
    return "admin";
  }

  const serviceClient = getSupabaseServerClient();
  if (!serviceClient) {
    return null;
  }

  const { data, error } = await serviceClient
    .from("admin_members")
    .select("role")
    .eq("user_id", user.id)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error("[admin:membership]", error.message);
    return null;
  }

  if (!data) return null;
  return data.role === "editor" ? "editor" : "admin";
}

export async function isAuthorizedAdmin(user: User): Promise<boolean> {
  const role = await resolveAdminRole(user);
  return role !== null;
}
