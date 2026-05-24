import type { AdminActivityItem, AdminDashboardStats } from "@/lib/admin/types";
import type { AdminKpiTrendMap } from "@/lib/admin/dashboard/kpi-trends";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import {
  AdminDashboardHero,
  dashboardStatIcons,
} from "@/components/admin/dashboard/AdminDashboardHero";
import { adminActivityBadge, adminActivityTone, adminStyles } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";

interface AdminDashboardViewProps {
  stats: AdminDashboardStats;
  activity: AdminActivityItem[];
  trends: AdminKpiTrendMap;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

const activityLabels = {
  devis: "Devis",
  preinscription: "Pré-inscription",
  message: "Message",
} as const;

export function AdminDashboardView({ stats, activity, trends }: AdminDashboardViewProps) {
  return (
    <>
      <AdminDashboardHero stats={stats} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AdminStatCard
          label="Sessions totales"
          value={stats.totalSessions}
          accent="neutral"
          icon={dashboardStatIcons.sessions}
          trend={trends.totalSessions}
        />
        <AdminStatCard
          label="Sessions à venir"
          value={stats.upcomingSessions}
          hint="Sessions visibles avec date future"
          accent="blue"
          icon={dashboardStatIcons.upcoming}
          trend={trends.upcomingSessions}
        />
        <AdminStatCard
          label="Sessions complètes"
          value={stats.fullSessions}
          accent="warning"
          icon={dashboardStatIcons.full}
          trend={trends.fullSessions}
        />
        <AdminStatCard
          label="Devis en attente"
          value={stats.pendingDevis}
          accent="gold"
          icon={dashboardStatIcons.devis}
          trend={trends.pendingDevis}
        />
        <AdminStatCard
          label="Pré-inscriptions en attente"
          value={stats.pendingPreinscriptions}
          accent="blue"
          icon={dashboardStatIcons.preinscription}
          trend={trends.pendingPreinscriptions}
        />
        <AdminStatCard
          label="Messages non lus"
          value={stats.unreadMessages}
          accent="success"
          icon={dashboardStatIcons.messages}
          trend={trends.unreadMessages}
        />
      </div>

      <section className={`mt-8 ${adminStyles.surface} overflow-hidden`}>
        <div className={adminStyles.sectionHeader}>
          <h2 className="text-sm font-semibold text-slate-900">Activité récente</h2>
          <p className="mt-0.5 text-xs text-slate-500">Dernières demandes et messages reçus</p>
        </div>
        <ul className="divide-y divide-slate-100 px-5 md:px-6">
          {activity.map((item) => (
            <li
              key={`${item.type}-${item.id}`}
              className={cn(
                "flex flex-col gap-2 border-l-[3px] py-4 pl-4 sm:flex-row sm:items-center sm:justify-between",
                adminActivityTone[item.type],
              )}
            >
              <div className="min-w-0">
                <span
                  className={cn(
                    "inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium",
                    adminActivityBadge[item.type],
                  )}
                >
                  {activityLabels[item.type]}
                </span>
                <p className="mt-1.5 text-sm font-medium text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-600">{item.detail}</p>
              </div>
              <time className="shrink-0 text-xs tabular-nums text-slate-500">
                {formatDate(item.submittedAt)}
              </time>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
