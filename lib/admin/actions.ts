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

function buildSessionFromInput(input: AdminSessionInput, existing?: PlanningSession): PlanningSession {
  const formation = input.formationSlug ? getFormation(input.formationSlug) : null;
  const year = Number(input.startDate.slice(0, 4));

  return {
    id: input.id ?? existing?.id ?? `session-${Date.now().toString(36)}`,
    formationSlug: input.formationSlug,
    formationTitle: input.formationTitle || formation?.title || existing?.formationTitle || "",
    sessionType: input.sessionType || existing?.sessionType || "Session",
    category: (formation?.category ?? existing?.category ?? "securite-incendie") as PlanningSession["category"],
    categoryLabel: formation?.categoryLabel ?? existing?.categoryLabel ?? "",
    startDate: input.startDate,
    endDate: input.endDate,
    examDate: input.examDate,
    scheduleLabel: input.scheduleLabel || existing?.scheduleLabel || "9h00 - 17h00",
    location: input.location || existing?.location || "",
    notes: existing?.notes ?? [],
    cpfEligible: input.cpfEligible ?? formation?.cpfEligible ?? false,
    certificationCode: input.certificationCode ?? formation?.certificationCode ?? null,
    status: input.status,
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
  const repo = await getPlanningRepository();
  const session = buildSessionFromInput(input);

  if (input.id) {
    await repo.update(input.id, session);
  } else {
    await repo.create(session);
  }

  revalidatePublicPaths();
  revalidateAdminPaths();
  return { ok: true as const, id: session.id };
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
  await repo.updatePreinscriptionStatus(id, status);
  revalidateAdminPaths();
  return { ok: true as const };
}

export async function updateContactMessageStatus(id: string, status: ContactMessageStatus) {
  await assertAdminAccess();
  const repo = await getMessagesRepository();
  await repo.updateMessageStatus(id, status);
  revalidateAdminPaths();
  return { ok: true as const };
}
