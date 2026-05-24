"use client";

import Link from "next/link";
import { useTransition } from "react";
import { signOutAdmin } from "@/lib/admin/auth-actions";
import { SITE } from "@/lib/constants";
import { adminStyles } from "@/components/admin/admin-styles";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  userEmail?: string | null;
  demoMode?: boolean;
}

export function AdminHeader({ userEmail, demoMode = false }: AdminHeaderProps) {
  const [pending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      await signOutAdmin();
    });
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-3.5 shadow-sm md:px-6">
      <div className="flex items-center gap-4">
        <BrandLogo size="about" />
        <div className="hidden h-8 w-px bg-slate-200 sm:block" />
        <div>
          <p className="text-sm font-semibold text-slate-900">Administration</p>
          <p className="text-xs text-slate-500">{SITE.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        {userEmail && !demoMode && (
          <p className="hidden max-w-[220px] truncate text-xs text-slate-500 lg:block">{userEmail}</p>
        )}
        {!demoMode && (
          <button
            type="button"
            onClick={handleSignOut}
            disabled={pending}
            className={cn(adminStyles.btnSecondary, "hidden sm:inline-flex")}
          >
            {pending ? "Déconnexion…" : "Déconnexion"}
          </button>
        )}
        <Link href="/" className={cn(adminStyles.btnSecondary, "inline-flex")}>
          ← Site public
        </Link>
      </div>
    </header>
  );
}
