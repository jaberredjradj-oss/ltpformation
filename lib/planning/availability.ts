import type { PlanningSession, PlanningSessionStatus } from "@/lib/planning/types";

export type ResolvedAvailabilityStatus =
  | "available"
  | "limited"
  | "full"
  | "cancelled"
  | "unknown";

export interface SessionAvailability {
  seatsTotal: number | null;
  seatsTaken: number | null;
  seatsRemaining: number | null;
  status: ResolvedAvailabilityStatus;
  label: string;
  fillRatio: number | null;
  canRegister: boolean;
  showMeter: boolean;
}

export const LIMITED_SEATS_ABSOLUTE = 3;
export const LIMITED_SEATS_RATIO = 0.2;

const STATUS_LABELS: Record<ResolvedAvailabilityStatus, string> = {
  available: "Disponible",
  limited: "Dernières places",
  full: "Complet",
  cancelled: "Annulée",
  unknown: "Disponible",
};

function buildAvailability(
  session: PlanningSession,
  status: ResolvedAvailabilityStatus,
  seatsTotal: number | null,
  seatsTaken: number | null,
  seatsRemaining: number | null,
): SessionAvailability {
  const fillRatio =
    seatsTotal !== null && seatsTaken !== null && seatsTotal > 0
      ? Math.min(1, seatsTaken / seatsTotal)
      : null;

  return {
    seatsTotal,
    seatsTaken,
    seatsRemaining,
    status,
    label: STATUS_LABELS[status],
    fillRatio,
    canRegister: status !== "full" && status !== "cancelled" && session.visible,
    showMeter: seatsTotal !== null && seatsTaken !== null && seatsTotal > 0,
  };
}

function isLimitedRemaining(seatsRemaining: number, seatsTotal: number): boolean {
  return (
    seatsRemaining <= LIMITED_SEATS_ABSOLUTE ||
    seatsRemaining / seatsTotal <= LIMITED_SEATS_RATIO
  );
}

export function resolveSessionAvailability(session: PlanningSession): SessionAvailability {
  if (!session.visible || session.status === "cancelled") {
    return buildAvailability(session, "cancelled", session.seatsTotal, session.seatsTaken, 0);
  }

  if (session.status === "full") {
    return buildAvailability(
      session,
      "full",
      session.seatsTotal,
      session.seatsTaken,
      0,
    );
  }

  const { seatsTotal, seatsTaken } = session;

  if (seatsTotal !== null && seatsTaken !== null) {
    const seatsRemaining = Math.max(0, seatsTotal - seatsTaken);

    if (seatsRemaining <= 0) {
      return buildAvailability(session, "full", seatsTotal, seatsTaken, 0);
    }

    if (isLimitedRemaining(seatsRemaining, seatsTotal)) {
      return buildAvailability(session, "limited", seatsTotal, seatsTaken, seatsRemaining);
    }

    return buildAvailability(session, "available", seatsTotal, seatsTaken, seatsRemaining);
  }

  if (session.status === "limited") {
    return buildAvailability(session, "limited", null, null, null);
  }

  return buildAvailability(session, "unknown", null, null, null);
}

export function mapLegacyStatus(status: PlanningSessionStatus): ResolvedAvailabilityStatus {
  switch (status) {
    case "open":
      return "available";
    case "limited":
      return "limited";
    case "full":
      return "full";
    case "cancelled":
      return "cancelled";
    default:
      return "unknown";
  }
}
