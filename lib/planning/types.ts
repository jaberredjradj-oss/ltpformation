import type { FormationCategoryId } from "@/lib/formations/types";

/** Admin-ready availability states for future dashboard control. */
export type PlanningSessionStatus = "open" | "limited" | "full" | "cancelled";

export interface PlanningSession {
  /** Stable identifier for admin updates and deep links. */
  id: string;
  /** Links to `/formations/[slug]` when matched to catalog. */
  formationSlug: string | null;
  formationTitle: string;
  sessionType: string;
  category: FormationCategoryId;
  categoryLabel: string;
  /** ISO date (YYYY-MM-DD). */
  startDate: string;
  /** ISO date (YYYY-MM-DD). */
  endDate: string;
  /** ISO date (YYYY-MM-DD) or null. */
  examDate: string | null;
  scheduleLabel: string;
  location: string;
  notes: string[];
  cpfEligible: boolean;
  certificationCode: string | null;
  status: PlanningSessionStatus;
  /** Admin: total seat capacity (null = not tracked yet). */
  seatsTotal: number | null;
  /** Admin: enrolled count (null = not tracked yet). */
  seatsTaken: number | null;
  /** Admin: hide session without deleting. */
  visible: boolean;
  year: number;
}

export interface PlanningFilters {
  query: string;
  category: FormationCategoryId | "all";
  cpfOnly: boolean;
}

export interface PlanningMonthGroup {
  key: string;
  label: string;
  sessions: PlanningSession[];
}

export const DEFAULT_PLANNING_FILTERS: PlanningFilters = {
  query: "",
  category: "all",
  cpfOnly: false,
};
