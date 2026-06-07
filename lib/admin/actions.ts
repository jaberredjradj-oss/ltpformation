"use server";

import { revalidatePath } from "next/cache";
import { assertAdminAccess } from "@/lib/admin/auth";
import type {
  AdminSessionInput,
  ContactMessageStatus,
  DevisRequestStatus,
  PreinscriptionStatus,
} from "@/lib/admin/types";
import type { PlanningSession } from "@/lib/planning/types";
import { getFormation } from "@/lib/formations/catalog";
import { FORMATION_CATEGORY_BY_ID } from "@/lib/formations/categories";
import type { FormationCategoryId } from "@/lib/formations/types";
import { applySeatTakenOnPreinscriptionValidation } from "@/lib/admin/planning-seat-on-validation";
import { getPlanningRepository } from "@/lib/repositories/planning";
import { getMessagesRepository, getSubmissionsRepository } from "@/lib/repositories";

function revalidatePublicPaths() {
  revalidatePath("/planning");
  revalidatePath("/devis");
  revalidatePath("/preinscription");
}

function revalidateAdminPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/planning");
  revalidatePath("/admin/demandes");
  revalidatePath("/admin/preinscriptions");
  revalidatePath("/admin/messages");
}

function generateSessionId(): string {
  return `session-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Server-side validation mirroring the editor. Returns a French message or null. */
function validateSessionInput(input: AdminSessionInput): string | null {
  if (!input.formationTitle.trim()) {
    return "Le nom de la session est obligatoire.";
  }
  if (!input.startDate) {
    return "La date de début est obligatoire.";
  }
  if (!input.endDate) {
    return "La date de fin est obligatoire.";
  }
  if (input.endDate < input.startDate) {
    return "La date de fin doit être identique ou postérieure à la date de début.";
  }
  if (input.examDate && input.examDate < input.startDate) {
    return "La date d'examen ne peut pas précéder le début de la session.";
  }
  if (!input.location.trim()) {
    return "Le lieu est obligatoire.";
  }
  if (input.seatsTotal !== null && input.seatsTotal < 0) {
    return "Le nombre de places totales ne peut pas être négatif.";
  }
  if (input.seatsTaken !== null && input.seatsTaken < 0) {
    return "Le nombre de places prises ne peut pas être négatif.";
  }
  if (
    input.seatsTotal !== null &&
    input.seatsTaken !== null &&
    input.seatsTaken > input.seatsTotal
  ) {
    return "Les places prises ne peuvent pas dépasser les places totales.";
  }
  return null;
}

function buildSessionFromInput(input: AdminSessionInput, existing?: PlanningSession): PlanningSession {
  const formation = input.formationSlug ? getFormation(input.formationSlug) : null;
  const year = Number(input.startDate.slice(0, 4));

  const category = (formation?.category ??
    input.category ??
    existing?.category ??
    "securite-incendie") as FormationCategoryId;
  const categoryLabel =
    formation?.categoryLabel ||
    input.categoryLabel ||
    existing?.categoryLabel ||
    FORMATION_CATEGORY_BY_ID[category]?.label ||
    "";

  // Safety: a session at (or over) capacity is always "full".
  let status = input.status;
  if (
    input.seatsTotal !== null &&
    input.seatsTaken !== null &&
    input.seatsTaken >= input.seatsTotal &&
    status !== "cancelled"
  ) {
    status = "full";
  }

  return {
    id: input.id ?? existing?.id ?? generateSessionId(),
    formationSlug: input.formationSlug,
    formationTitle: input.formationTitle.trim() || formation?.title || existing?.formationTitle || "",
    sessionType: input.sessionType.trim() || formation?.typeLabel || existing?.sessionType || "Session",
    category,
    categoryLabel,
    startDate: input.startDate,
    endDate: input.endDate,
    examDate: input.examDate,
    scheduleLabel: input.scheduleLabel.trim() || existing?.scheduleLabel || "9h00 - 17h00",
    location: input.location.trim() || existing?.location || "",
    notes: existing?.notes ?? [],
    cpfEligible: input.cpfEligible ?? formation?.cpfEligible ?? false,
    certificationCode: input.certificationCode ?? formation?.certificationCode ?? null,
    status,
    seatsTotal: input.seatsTotal,
    seatsTaken: input.seatsTaken,
    visible: input.visible,
    year,
  };
}

export async function toggleSessionVisibility(sessionId: string, visible: boolean) {
  await assertAdminAccess();
  const repo = await getPlanningRepository();
  await repo.update(sessionId, { visible });
  revalidatePublicPaths();
  revalidateAdminPaths();
  return { ok: true as const };
}

export async function markSessionFull(sessionId: string) {
  await assertAdminAccess();
  const repo = await getPlanningRepository();
  const session = await repo.getById(sessionId);
  if (!session) return { ok: false as const, error: "Session introuvable." };

  const seatsTaken =
    session.seatsTotal !== null
      ? session.seatsTotal
      : session.seatsTaken;

  await repo.update(sessionId, {
    status: "full",
    seatsTaken,
  });

  revalidatePublicPaths();
  revalidateAdminPaths();
  return { ok: true as const };
}

export async function updateSessionSeats(
  sessionId: string,
  seatsTotal: number | null,
  seatsTaken: number | null,
) {
  await assertAdminAccess();
  const repo = await getPlanningRepository();
  const patch: Partial<PlanningSession> = { seatsTotal, seatsTaken };

  if (
    seatsTotal !== null &&
    seatsTaken !== null &&
    seatsTaken >= seatsTotal
  ) {
    patch.status = "full";
  }

  await repo.update(sessionId, patch);
  revalidatePublicPaths();
  revalidateAdminPaths();
  return { ok: true as const };
}

export async function saveSession(input: AdminSessionInput) {
  await assertAdminAccess();

  const validationError = validateSessionInput(input);
  if (validationError) {
    return { ok: false as const, error: validationError };
  }

  const repo = await getPlanningRepository();

  try {
    if (input.id) {
      const existing = await repo.getById(input.id);
      if (!existing) {
        return { ok: false as const, error: "Session introuvable." };
      }
      const session = buildSessionFromInput(input, existing);
      await repo.update(input.id, session);
      revalidatePublicPaths();
      revalidateAdminPaths();
      return { ok: true as const, id: session.id };
    }

    const session = buildSessionFromInput(input);
    await repo.create(session);
    revalidatePublicPaths();
    revalidateAdminPaths();
    return { ok: true as const, id: session.id };
  } catch {
    return { ok: false as const, error: "Enregistrement impossible. Réessayez." };
  }
}

export async function archiveSession(sessionId: string) {
  await assertAdminAccess();
  const repo = await getPlanningRepository();
  try {
    await repo.update(sessionId, { status: "cancelled", visible: false });
  } catch {
    return { ok: false as const, error: "Archivage impossible. Réessayez." };
  }
  revalidatePublicPaths();
  revalidateAdminPaths();
  return { ok: true as const };
}

export async function deleteSession(sessionId: string) {
  await assertAdminAccess();
  const repo = await getPlanningRepository();
  try {
    await repo.delete(sessionId);
  } catch {
    return {
      ok: false as const,
      error:
        "Suppression impossible : des inscriptions sont peut-être liées à cette session. Archivez-la plutôt.",
    };
  }
  revalidatePublicPaths();
  revalidateAdminPaths();
  return { ok: true as const };
}

export async function updateDevisStatus(id: string, status: DevisRequestStatus) {
  await assertAdminAccess();
  const repo = await getSubmissionsRepository();
  await repo.updateDevisStatus(id, status);
  revalidateAdminPaths();
  return { ok: true as const };
}

export async function updatePreinscriptionStatus(id: string, status: PreinscriptionStatus) {
  await assertAdminAccess();
  const repo = await getSubmissionsRepository();
  const preinscriptions = await repo.listPreinscriptions();
  const preinscription = preinscriptions.find((entry) => entry.id === id);

  const seatUpdated = await applySeatTakenOnPreinscriptionValidation(
    preinscription?.status ?? "pending",
    status,
    preinscription?.sessionId,
  );
  await repo.updatePreinscriptionStatus(id, status);
  revalidateAdminPaths();
  if (status === "validated" || seatUpdated) {
    revalidatePublicPaths();
  }
  return { ok: true as const };
}

export async function updateContactMessageStatus(id: string, status: ContactMessageStatus) {
  await assertAdminAccess();
  const repo = await getMessagesRepository();
  await repo.updateMessageStatus(id, status);
  revalidateAdminPaths();
  return { ok: true as const };
}
