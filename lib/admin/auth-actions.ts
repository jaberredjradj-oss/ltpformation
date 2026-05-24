"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAuthorizedAdmin } from "@/lib/auth/membership";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import { isAdminAuthEnabled } from "@/lib/db/env";

export type AdminSignInResult =
  | { ok: true }
  | { ok: false; error: string };

export async function signInAdmin(
  email: string,
  password: string,
): Promise<AdminSignInResult> {
  if (!isAdminAuthEnabled()) {
    return { ok: false, error: "Authentification admin non activée." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.user) {
    return { ok: false, error: "Identifiants invalides." };
  }

  if (!(await isAuthorizedAdmin(data.user))) {
    await supabase.auth.signOut();
    return { ok: false, error: "Ce compte n'a pas accès à l'administration." };
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function signOutAdmin(): Promise<void> {
  if (!isAdminAuthEnabled()) {
    redirect("/admin");
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/admin");
  redirect("/admin/login");
}
