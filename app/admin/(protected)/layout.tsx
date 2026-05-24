import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSession, isAdminDemoMode, requireAdminSession } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Administration",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = isAdminDemoMode() ? await getAdminSession() : await requireAdminSession();

  return (
    <AdminShell demoMode={session?.demo ?? false} userEmail={session?.email ?? null}>
      {children}
    </AdminShell>
  );
}
