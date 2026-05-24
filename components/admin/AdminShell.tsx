"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminToastProvider } from "@/components/admin/AdminToast";
import { adminStyles } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  children: React.ReactNode;
  demoMode: boolean;
  userEmail?: string | null;
}

export function AdminShell({ children, demoMode, userEmail = null }: AdminShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <AdminToastProvider>
      <div className="min-h-screen bg-[#f6f7f9]">
        <AdminHeader userEmail={userEmail} demoMode={demoMode} />

        {demoMode && (
          <div className="border-b border-amber-200 bg-amber-50 px-5 py-2 text-center text-xs font-medium text-amber-900 md:px-6">
            Mode démo — authentification désactivée. Activez{" "}
            <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[11px]">
              ADMIN_AUTH=true
            </code>{" "}
            en production.
          </div>
        )}

        <div className="mx-auto flex w-full max-w-[1440px]">
          <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-gradient-to-b from-white to-blue-50/20 px-4 py-6 lg:block">
            <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Navigation
            </p>
            <AdminNav />
          </aside>

          <div className="min-w-0 flex-1">
            <div className="border-b border-slate-200 bg-white px-5 py-3 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileNavOpen((open) => !open)}
                className={cn(adminStyles.btnSecondary, "h-9 px-3.5")}
              >
                {mobileNavOpen ? "Fermer le menu" : "Menu admin"}
              </button>
              {mobileNavOpen && (
                <div className={cn("mt-3 p-3", adminStyles.surfaceMuted)}>
                  <AdminNav />
                </div>
              )}
            </div>

            <main className="px-5 py-7 md:px-8 md:py-9">{children}</main>
          </div>
        </div>
      </div>
    </AdminToastProvider>
  );
}
