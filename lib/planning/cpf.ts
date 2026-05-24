import { getFormation } from "@/lib/formations/catalog";
import type { PlanningSession } from "@/lib/planning/types";

/**
 * CPF eligibility follows the formations catalog.
 * Sessions can opt out explicitly (e.g. MAC APS, PSGE module) via cpfEligible: false.
 */
export function isSessionCpfEligible(session: PlanningSession): boolean {
  if (session.cpfEligible === false) {
    return false;
  }

  if (!session.formationSlug) {
    return false;
  }

  const formation = getFormation(session.formationSlug);
  return formation?.cpfEligible ?? false;
}

export function countCpfEligibleSessions(sessions: PlanningSession[]): number {
  return sessions.filter(isSessionCpfEligible).length;
}
