"use client";

import {
  formatTrendPercent,
  isTrendPositive,
  normalizeSparklineSeries,
  type AdminKpiTrend,
} from "@/lib/admin/dashboard/kpi-trends";
import { cn } from "@/lib/utils";

type SparklineAccent = "blue" | "gold" | "neutral" | "warning" | "success";

const strokeColors: Record<SparklineAccent, string> = {
  blue: "#2563eb",
  gold: "#d97706",
  neutral: "#64748b",
  warning: "#ea580c",
  success: "#059669",
};

const fillColors: Record<SparklineAccent, string> = {
  blue: "rgba(37, 99, 235, 0.08)",
  gold: "rgba(217, 119, 6, 0.08)",
  neutral: "rgba(100, 116, 139, 0.08)",
  warning: "rgba(234, 88, 12, 0.08)",
  success: "rgba(5, 150, 105, 0.08)",
};

interface AdminKpiSparklineProps {
  trend: AdminKpiTrend;
  accent?: SparklineAccent;
  className?: string;
}

function TrendArrow({ up }: { up: boolean }) {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0" aria-hidden>
      {up ? (
        <path d="M6 2.5 9.5 7H2.5L6 2.5Z" fill="currentColor" />
      ) : (
        <path d="M6 9.5 2.5 5h7L6 9.5Z" fill="currentColor" />
      )}
    </svg>
  );
}

export function AdminKpiTrendBadge({ trend }: { trend: AdminKpiTrend }) {
  const positive = isTrendPositive(trend.changePercent);
  const neutral = trend.changePercent === 0;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular-nums",
        neutral && "bg-slate-100 text-slate-600",
        !neutral && positive && "bg-emerald-50 text-emerald-700",
        !neutral && !positive && "bg-red-50 text-red-600",
      )}
    >
      {formatTrendPercent(trend.changePercent)}
      {!neutral && <TrendArrow up={positive} />}
    </span>
  );
}

export function AdminKpiSparkline({ trend, accent = "neutral", className }: AdminKpiSparklineProps) {
  const normalized = normalizeSparklineSeries(trend.series);
  const width = 72;
  const height = 28;
  const padding = 2;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const points = normalized.map((y, index) => {
    const x =
      normalized.length === 1
        ? width / 2
        : padding + (index / (normalized.length - 1)) * innerW;
    const py = padding + (1 - y) * innerH;
    return `${x},${py}`;
  });

  const linePath = `M ${points.join(" L ")}`;
  const areaPath = `${linePath} L ${padding + innerW},${height - padding} L ${padding},${height - padding} Z`;
  const stroke = strokeColors[accent];
  const fill = fillColors[accent];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-7 w-[4.5rem] shrink-0", className)}
      aria-hidden
    >
      <path d={areaPath} fill={fill} />
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.85}
      />
    </svg>
  );
}

export function AdminKpiMiniBars({ trend, accent = "neutral" }: AdminKpiSparklineProps) {
  const normalized = normalizeSparklineSeries(trend.series);
  const barColor = strokeColors[accent];

  return (
    <div className="flex h-5 items-end gap-0.5" aria-hidden>
      {normalized.map((value, index) => (
        <span
          key={index}
          className="w-1 rounded-sm bg-current opacity-40"
          style={{
            height: `${Math.max(20, value * 100)}%`,
            color: barColor,
          }}
        />
      ))}
    </div>
  );
}

interface AdminKpiTrendRowProps {
  trend: AdminKpiTrend;
  accent?: SparklineAccent;
}

export function AdminKpiTrendRow({ trend, accent = "neutral" }: AdminKpiTrendRowProps) {
  return (
    <div className="mt-4 flex items-end justify-between gap-3 rounded-md bg-white/50 py-2.5">
      <div>
        <AdminKpiTrendBadge trend={trend} />
        <p className="mt-1 text-[10px] text-slate-400">{trend.periodLabel}</p>
      </div>
      <div className="flex items-end gap-2">
        <AdminKpiMiniBars trend={trend} accent={accent} />
        <AdminKpiSparkline trend={trend} accent={accent} />
      </div>
    </div>
  );
}
