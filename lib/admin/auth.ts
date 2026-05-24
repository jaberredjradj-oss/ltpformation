import { redirect } from "next/navigation";
import { isAuthorizedAdmin, resolveAdminRole } from "@/lib/auth/membership";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import type { AdminSession } from "@/lib/auth/types";
import { isAdminAuthEnabled } from "@/lib/db/env";

export function isAdminDemoMode(): boolean {
  return !isAdminAuthEnabled();
}

export function isAdminAccessGranted(): boolean {
  return isAdminDemoMode();
}

export async function getAdminSession(): Promise<AdminSession | null> {
  if (isAdminDemoMode()) {
    return {
      userId: "demo",
      email: "demo@local",
      role: "admin",
      demo: true,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const role = await resolveAdminRole(user);
  if (!role) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email ?? "",
    role,
    demo: false,
  };
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export async function assertAdminAccess(): Promise<AdminSession> {
  if (isAdminDemoMode()) {
    return {
      userId: "demo",
      email: "demo@local",
      role: "admin",
      demo: true,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !(await isAuthorizedAdmin(user))) {
    throw new Error("Admin access denied.");
  }

  const role = await resolveAdminRole(user);
  if (!role) {
    throw new Error("Admin access denied.");
  }

  return {
    userId: user.id,
    email: user.email ?? "",
    role,
    demo: false,
  };
}

/** @deprecated Use assertAdminAccess() in server actions. */
export function requireAdminAccess(): void {
  if (isAdminDemoMode()) return;
  throw new Error("Admin access denied.");
}
