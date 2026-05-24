"use client";

import { adminStyles } from "@/components/admin/admin-styles";
import { AdminKpiTrendRow } from "@/components/admin/AdminKpiSparkline";
import type { AdminKpiTrend } from "@/lib/admin/dashboard/kpi-trends";
import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  label: string;
  value: number | string;
  hint?: string;
  accent?: "blue" | "gold" | "neutral" | "warning" | "success";
  icon?: React.ReactNode;
  trend?: AdminKpiTrend;
}

const accentStyles = {
  blue: {
    card: "border-blue-100/90 bg-gradient-to-br from-blue-50/90 via-white to-white border-l-blue-600",
    value: "text-blue-950",
    icon: "bg-blue-100 text-blue-700",
  },
  gold: {
    card: "border-amber-100/90 bg-gradient-to-br from-amber-50/80 via-white to-white border-l-amber-500",
    value: "text-amber-950",
    icon: "bg-amber-100 text-amber-700",
  },
  neutral: {
    card: "border-slate-200 bg-gradient-to-br from-slate-50/80 via-white to-white border-l-slate-400",
    value: "text-slate-900",
    icon: "bg-slate-100 text-slate-600",
  },
  warning: {
    card: "border-orange-100/90 bg-gradient-to-br from-orange-50/70 via-white to-white border-l-orange-500",
    value: "text-orange-950",
    icon: "bg-orange-100 text-orange-700",
  },
  success: {
    card: "border-emerald-100/90 bg-gradient-to-br from-emerald-50/70 via-white to-white border-l-emerald-500",
    value: "text-emerald-950",
    icon: "bg-emerald-100 text-emerald-700",
  },
};

export function AdminStatCard({
  label,
  value,
  hint,
  accent = "neutral",
  icon,
  trend,
}: AdminStatCardProps) {
  const styles = accentStyles[accent];

  return (
    <article
      className={cn(
        adminStyles.surface,
        "border-l-[3px] p-5 transition-shadow hover:shadow-md",
        styles.card,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={adminStyles.label}>{label}</p>
        {icon && (
          <span
            className={cn(
              "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
              styles.icon,
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <p
        className={cn(
          "mt-2 text-[1.75rem] font-semibold tabular-nums leading-none tracking-tight",
          styles.value,
        )}
      >
        {value}
      </p>
      {trend && <AdminKpiTrendRow trend={trend} accent={accent} />}
      {hint && (
        <p className={cn("text-xs leading-relaxed text-slate-500", trend ? "mt-2" : "mt-2.5")}>
          {hint}
        </p>
      )}
    </article>
  );
}
