import { resolveSessionAvailability } from "@/lib/planning/availability";
import { formatSessionDateRange } from "@/lib/planning/format";
import type { AdminPlanningRow } from "@/lib/admin/types";
import type { PlanningSession } from "@/lib/planning/types";
import { loadPlanningSessions } from "@/lib/repositories/planning";

function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDuration(session: PlanningSession): string {
  const start = parseIsoDate(session.startDate);
  const end = parseIsoDate(session.endDate);
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
  if (days <= 1) return "1 jour";
  return `${days} jours`;
}

export async function getAdminPlanningRows(): Promise<AdminPlanningRow[]> {
  const sessions = await loadPlanningSessions();

  return sessions.map((session) => {
    const availability = resolveSessionAvailability(session);

    return {
      id: session.id,
      formationTitle: session.formationTitle,
      formationSlug: session.formationSlug,
      categoryLabel: session.categoryLabel,
      dateLabel: formatSessionDateRange(session.startDate, session.endDate),
      startDate: session.startDate,
      monthKey: session.startDate.slice(0, 7),
      durationLabel: formatDuration(session),
      location: session.location,
      seatsTotal: availability.seatsTotal,
      seatsTaken: availability.seatsTaken,
      seatsRemaining: availability.seatsRemaining,
      availabilityLabel: availability.label,
      status: session.status,
      visible: session.visible,
    };
  });
}

export async function countUpcomingSessions(referenceDate = new Date()): Promise<number> {
  const sessions = await loadPlanningSessions();
  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );

  return sessions.filter((session) => {
    const start = parseIsoDate(session.startDate);
    return session.visible && start >= today;
  }).length;
}

export async function countFullSessions(): Promise<number> {
  const sessions = await loadPlanningSessions();
  return sessions.filter(
    (session) => resolveSessionAvailability(session).status === "full",
  ).length;
}

export async function countTotalSessions(): Promise<number> {
  const sessions = await loadPlanningSessions();
  return sessions.length;
}
