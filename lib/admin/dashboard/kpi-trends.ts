/**
 * KPI trend analytics — demo data for now.
 * Replace `getDashboardKpiTrends` body with real time-series when analytics are available.
 */

export type AdminKpiId =
  | "totalSessions"
  | "upcomingSessions"
  | "fullSessions"
  | "pendingDevis"
  | "pendingPreinscriptions"
  | "unreadMessages";

export interface AdminKpiTrend {
  /** Period-over-period change, e.g. 12 for +12 %. */
  changePercent: number;
  /** Sparkline points (oldest → newest). Values are relative, not absolute counts. */
  series: number[];
  /** Short comparison label shown under the trend. */
  periodLabel: string;
}

export type AdminKpiTrendMap = Record<AdminKpiId, AdminKpiTrend>;

/** Static demo trends — swap for repository/analytics queries later. */
const DEMO_KPI_TRENDS: AdminKpiTrendMap = {
  totalSessions: {
    changePercent: 4,
    series: [18, 19, 20, 19, 21, 22, 23],
    periodLabel: "vs. mois dernier",
  },
  upcomingSessions: {
    changePercent: 12,
    series: [8, 9, 10, 11, 12, 13, 14],
    periodLabel: "vs. mois dernier",
  },
  fullSessions: {
    changePercent: -2,
    series: [5, 4, 5, 6, 5, 4, 4],
    periodLabel: "vs. mois dernier",
  },
  pendingDevis: {
    changePercent: -8,
    series: [12, 11, 10, 9, 8, 7, 6],
    periodLabel: "vs. sem. dernière",
  },
  pendingPreinscriptions: {
    changePercent: 24,
    series: [6, 7, 8, 10, 11, 13, 15],
    periodLabel: "vs. sem. dernière",
  },
  unreadMessages: {
    changePercent: 5,
    series: [2, 3, 2, 4, 3, 5, 4],
    periodLabel: "vs. sem. dernière",
  },
};

export async function getDashboardKpiTrends(): Promise<AdminKpiTrendMap> {
  // Future: derive series + changePercent from historical snapshots in Supabase.
  return DEMO_KPI_TRENDS;
}

export function formatTrendPercent(changePercent: number): string {
  const rounded = Math.round(changePercent);
  if (rounded > 0) return `+${rounded} %`;
  if (rounded < 0) return `${rounded} %`;
  return "0 %";
}

export function isTrendPositive(changePercent: number): boolean {
  return changePercent > 0;
}

/** Normalize series to 0–1 for SVG sparkline height. */
export function normalizeSparklineSeries(series: number[]): number[] {
  if (series.length === 0) return [];
  if (series.length === 1) return [0.5];

  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min;

  if (range === 0) {
    return series.map(() => 0.5);
  }

  return series.map((value) => (value - min) / range);
}
