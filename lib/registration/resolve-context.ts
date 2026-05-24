import { getFormation, FORMATIONS } from "@/lib/formations/catalog";
import { isSessionCpfEligible } from "@/lib/planning/cpf";
import {
  formatExamLabel,
  formatSessionDateRange,
} from "@/lib/planning/format";
import {
  getPlanningSessionById,
  getVisiblePlanningSessions,
  queryPlanningSessions,
} from "@/lib/planning/search";
import { resolveSessionAvailability } from "@/lib/planning/availability";
import type { PlanningSession } from "@/lib/planning/types";
import type { Formation } from "@/lib/formations/types";
import type { RegistrationIntent, RegistrationSessionSnapshot } from "@/lib/registration/types";
import type { SessionAvailability } from "@/lib/planning/availability";

export interface RegistrationContext {
  intent: RegistrationIntent;
  formation: Formation | null;
  session: PlanningSession | null;
  availability: SessionAvailability | null;
  cpfEligible: boolean;
  sessionOptions: PlanningSession[];
  formationOptions: Formation[];
}

function buildSessionSnapshot(session: PlanningSession): RegistrationSessionSnapshot {
  const availability = resolveSessionAvailability(session);

  return {
    id: session.id,
    title: session.formationTitle,
    dateRange: formatSessionDateRange(session.startDate, session.endDate),
    examLabel: session.examDate ? formatExamLabel(session.examDate) : null,
    availabilityLabel: availability.label,
    location: session.location,
  };
}

export function getUpcomingSessionsForFormation(
  slug: string,
  sessions: PlanningSession[],
): PlanningSession[] {
  return queryPlanningSessions(getVisiblePlanningSessions(sessions), {
    query: "",
    category: "all",
    cpfOnly: false,
  }).filter((session) => session.formationSlug === slug);
}

export function resolveRegistrationContext(
  intent: RegistrationIntent,
  sessions: PlanningSession[],
  formationSlug?: string | null,
  sessionId?: string | null,
): RegistrationContext {
  const formationOptions = FORMATIONS;
  const formation = formationSlug ? getFormation(formationSlug) ?? null : null;
  const session = sessionId ? getPlanningSessionById(sessionId, sessions) ?? null : null;

  const resolvedFormationSlug = session?.formationSlug ?? formationSlug ?? "";
  const sessionOptions = resolvedFormationSlug
    ? getUpcomingSessionsForFormation(resolvedFormationSlug, sessions)
    : [];

  const resolvedFormation = resolvedFormationSlug
    ? getFormation(resolvedFormationSlug) ?? formation
    : formation;

  const availability = session ? resolveSessionAvailability(session) : null;
  const cpfEligible = session
    ? isSessionCpfEligible(session)
    : resolvedFormation?.cpfEligible ?? false;

  return {
    intent,
    formation: resolvedFormation,
    session,
    availability,
    cpfEligible,
    sessionOptions,
    formationOptions,
  };
}

export { buildSessionSnapshot };
