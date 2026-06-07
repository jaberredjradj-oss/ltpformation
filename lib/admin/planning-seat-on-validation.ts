import type { PreinscriptionStatus } from "@/lib/admin/types";
import {
  LIMITED_SEATS_ABSOLUTE,
  LIMITED_SEATS_RATIO,
} from "@/lib/planning/availability";
import type { PlanningSession, PlanningSessionStatus } from "@/lib/planning/types";
import { getPlanningRepository } from "@/lib/repositories/planning";

function isLimitedRemaining(seatsRemaining: number, seatsTotal: number): boolean {
  return (
    seatsRemaining <= LIMITED_SEATS_ABSOLUTE ||
    seatsRemaining / seatsTotal <= LIMITED_SEATS_RATIO
  );
}

function resolveStatusAfterSeatTaken(
  session: PlanningSession,
  seatsTaken: number,
): PlanningSessionStatus {
  const { seatsTotal } = session;
  if (seatsTotal === null) {
    return session.status;
  }

  if (seatsTaken >= seatsTotal) {
    return "full";
  }

  const seatsRemaining = seatsTotal - seatsTaken;
  if (isLimitedRemaining(seatsRemaining, seatsTotal)) {
    return "limited";
  }

  if (session.status === "full" || session.status === "limited") {
    return "open";
  }

  return session.status;
}

/**
 * Increments seats_taken by 1 when a pré-inscription is newly validated.
 * Idempotent: no-op if already validated, refused, or capacity is not tracked.
 */
export async function applySeatTakenOnPreinscriptionValidation(
  previousStatus: PreinscriptionStatus,
  newStatus: PreinscriptionStatus,
  sessionId: string | null | undefined,
): Promise<boolean> {
  if (newStatus !== "validated" || previousStatus === "validated") {
    return false;
  }

  const linkedSessionId = sessionId?.trim();
  if (!linkedSessionId) {
    return false;
  }

  const planningRepo = await getPlanningRepository();
  const session = await planningRepo.getById(linkedSessionId);
  if (!session) {
    return false;
  }

  const { seatsTotal, seatsTaken } = session;
  if (seatsTotal === null || seatsTaken === null) {
    return false;
  }

  if (seatsTaken >= seatsTotal) {
    return false;
  }

  const nextSeatsTaken = Math.min(seatsTotal, seatsTaken + 1);
  if (nextSeatsTaken === seatsTaken) {
    return false;
  }

  await planningRepo.update(linkedSessionId, {
    seatsTaken: nextSeatsTaken,
    status: resolveStatusAfterSeatTaken(session, nextSeatsTaken),
  });

  return true;
}
