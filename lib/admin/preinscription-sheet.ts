import { PREINSCRIPTION_STATUS_LABELS } from "@/lib/admin/constants";
import type { PreinscriptionSheetData } from "@/lib/pdf/preinscription-sheet-types";
import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import { isRealDataEnabled } from "@/lib/db/env";
import { formatSessionDateRange } from "@/lib/planning/format";
import { findPlanningSessionById } from "@/lib/repositories/planning";
import { getSubmissionsRepository } from "@/lib/repositories";

function formatSubmittedAt(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function buildSessionDetails(session: Awaited<ReturnType<typeof findPlanningSessionById>>): string | null {
  if (!session) return null;

  const parts = [
    formatSessionDateRange(session.startDate, session.endDate),
    session.scheduleLabel,
    session.location,
  ];

  if (session.examDate) {
    parts.push(`Examen : ${session.examDate}`);
  }

  return parts.filter(Boolean).join(" · ");
}

async function loadObservations(id: string): Promise<string | null> {
  if (!isRealDataEnabled()) return null;

  const client = getSupabaseServerClient();
  if (!client) return null;

  const { data } = await client
    .from("preinscriptions")
    .select("message")
    .eq("id", id)
    .maybeSingle();

  const message = data?.message?.trim();
  return message || null;
}

export async function getPreinscriptionSheetData(
  id: string,
): Promise<PreinscriptionSheetData | null> {
  const repo = await getSubmissionsRepository();
  const items = await repo.listPreinscriptions();
  const item = items.find((entry) => entry.id === id);
  if (!item) return null;

  const [session, observations] = await Promise.all([
    findPlanningSessionById(item.sessionId),
    loadObservations(id),
  ]);

  return {
    id: item.id,
    lastName: item.lastName,
    firstName: item.firstName,
    phone: item.phone,
    email: item.email,
    formationTitle: item.formationTitle,
    sessionLabel: item.sessionLabel,
    submittedAtLabel: formatSubmittedAt(item.submittedAt),
    statusLabel: PREINSCRIPTION_STATUS_LABELS[item.status],
    reservedSeatsLabel: "1 place",
    cpfFinancing: item.cpfFinancing,
    observations,
    sessionDetails: buildSessionDetails(session),
    reference: item.id.slice(0, 8).toUpperCase(),
  };
}
