import Link from "next/link";
import type { ReactNode } from "react";
import type { AdminDashboardStats } from "@/lib/admin/types";
import { adminStyles } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";

interface AdminDashboardHeroProps {
  stats: AdminDashboardStats;
}

function pendingTotal(stats: AdminDashboardStats): number {
  return stats.pendingDevis + stats.pendingPreinscriptions + stats.unreadMessages;
}

export function AdminDashboardHero({ stats }: AdminDashboardHeroProps) {
  const pending = pendingTotal(stats);

  return (
    <section className={cn(adminStyles.surfaceNavy, "mb-7 overflow-hidden p-6 md:p-8")}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className={adminStyles.eyebrow}>Centre opérationnel</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-[1.65rem]">
            Tableau de bord LT Protect Formation
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Suivez les sessions, demandes et messages en un coup d&apos;œil. Priorisez les actions
            en attente pour maintenir un service réactif.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="rounded-md border border-blue-100 bg-blue-50/70 px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-blue-700">
              À traiter
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-blue-950">{pending}</p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white/80 px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Sessions actives
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
              {stats.upcomingSessions}
            </p>
          </div>
        </div>
      </div>

      {pending > 0 && (
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-200/80 pt-5">
          {stats.unreadMessages > 0 && (
            <Link
              href="/admin/messages"
              className="rounded-md border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs font-medium text-emerald-800 transition-colors hover:bg-emerald-100"
            >
              {stats.unreadMessages} message{stats.unreadMessages > 1 ? "s" : ""} non lu
              {stats.unreadMessages > 1 ? "s" : ""}
            </Link>
          )}
          {stats.pendingPreinscriptions > 0 && (
            <Link
              href="/admin/preinscriptions"
              className="rounded-md border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-100"
            >
              {stats.pendingPreinscriptions} pré-inscription
              {stats.pendingPreinscriptions > 1 ? "s" : ""} en attente
            </Link>
          )}
          {stats.pendingDevis > 0 && (
            <Link
              href="/admin/demandes"
              className="rounded-md border border-amber-200 bg-amber-50/80 px-3 py-1.5 text-xs font-medium text-amber-900 transition-colors hover:bg-amber-100"
            >
              {stats.pendingDevis} devis en attente
            </Link>
          )}
        </div>
      )}
    </section>
  );
}

function StatIcon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
      {children}
    </svg>
  );
}

export const dashboardStatIcons = {
  sessions: (
    <StatIcon>
      <path d="M6 2a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1V3a1 1 0 1 0-2 0v1H7V3a1 1 0 0 0-1-1ZM4 8h12v8H4V8Z" />
    </StatIcon>
  ),
  upcoming: (
    <StatIcon>
      <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 0-2 0v4.25a1 1 0 0 0 .293.707l2.5 2.5a1 1 0 0 0 1.414-1.414L11 9.586V6Z" />
    </StatIcon>
  ),
  full: (
    <StatIcon>
      <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm3.707 5.293a1 1 0 0 0-1.414-1.414L9 9.172 7.707 7.879a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z" />
    </StatIcon>
  ),
  devis: (
    <StatIcon>
      <path d="M4 3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4Zm0 2h12v2H4V5Zm0 4h12v6H4V9Z" />
    </StatIcon>
  ),
  preinscription: (
    <StatIcon>
      <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 16a4 4 0 0 1 8 0H4Zm9-1a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm1 1a5 5 0 0 0-4.2 2.2 6.01 6.01 0 0 1 2.2-4.2Z" />
    </StatIcon>
  ),
  messages: (
    <StatIcon>
      <path d="M2 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9.83l-3.59 3.59A1 1 0 0 1 5 16.83V13H4a2 2 0 0 1-2-2V5Z" />
    </StatIcon>
  ),
};
