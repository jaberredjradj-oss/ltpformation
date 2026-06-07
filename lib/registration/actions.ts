"use server";

import { getFormation } from "@/lib/formations/catalog";
import { resolveSessionAvailability } from "@/lib/planning/availability";
import { getPlanningSessionById } from "@/lib/planning/search";
import { buildSessionSnapshot } from "@/lib/registration/resolve-context";
import { isLikelySpam } from "@/lib/registration/antispam";
import {
  hasValidationErrors,
  validateRegistrationForm,
} from "@/lib/registration/validation";
import type {
  RegistrationFormValues,
  RegistrationIntent,
} from "@/lib/registration/types";
import { loadPlanningSessions } from "@/lib/repositories/planning";
import { notifyTeamOfFormSubmission } from "@/lib/email/internal-notification";
import type { RegistrationSessionSnapshot } from "@/lib/registration/types";
import { getSubmissionsRepository } from "@/lib/repositories";
import { notificationDispatcher } from "@/lib/notifications/dispatcher";
import { ensureSupabaseEnvironmentValidated } from "@/lib/db/supabase-env";

export interface RegistrationSubmitPayload {
  intent: RegistrationIntent;
  values: RegistrationFormValues;
  consentAccepted: boolean;
  honeypot: string;
  formLoadedAt: number;
}

export type RegistrationSubmitResult =
  | { ok: true; submissionId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function createSubmissionId(): string {
  return `req-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatSessionDetail(snapshot: RegistrationSessionSnapshot | null): string {
  if (!snapshot) return "—";

  const parts = [snapshot.title, snapshot.dateRange, snapshot.location];
  if (snapshot.examLabel) parts.push(`Examen : ${snapshot.examLabel}`);
  return parts.join(" · ");
}

const CPF_LABELS = { yes: "Oui", no: "Non", unknown: "Ne sait pas" } as const;
const ON_SITE_LABELS = { yes: "Oui", no: "Non", unknown: "À définir" } as const;

export async function submitRegistration(
  payload: RegistrationSubmitPayload,
): Promise<RegistrationSubmitResult> {
  if (isLikelySpam({ honeypot: payload.honeypot, formLoadedAt: payload.formLoadedAt })) {
    return { ok: true, submissionId: createSubmissionId() };
  }

  const fieldErrors = validateRegistrationForm(payload.values, payload.intent) as Record<
    string,
    string
  >;

  if (!payload.consentAccepted) {
    fieldErrors.consent = "Veuillez accepter la politique de confidentialité.";
  }

  if (hasValidationErrors(fieldErrors)) {
    return {
      ok: false,
      error: "Certains champs sont invalides.",
      fieldErrors,
    };
  }

  const formation = getFormation(payload.values.formationSlug);
  if (!formation) {
    return {
      ok: false,
      error: "Formation introuvable.",
      fieldErrors: { formationSlug: "Formation invalide." },
    };
  }

  const sessions = await loadPlanningSessions();
  const session = payload.values.sessionId
    ? getPlanningSessionById(payload.values.sessionId, sessions) ?? null
    : null;

  if (payload.intent === "preinscription" && !session) {
    return {
      ok: false,
      error: "Session introuvable.",
      fieldErrors: { sessionId: "Session invalide." },
    };
  }

  if (session && payload.intent === "preinscription") {
    const availability = resolveSessionAvailability(session);
    if (!availability.canRegister) {
      return {
        ok: false,
        error: "Cette session est complète.",
        fieldErrors: { sessionId: "Cette session est complète. Choisissez une autre date." },
      };
    }
  }

  const employeeCount = payload.values.employeeCount.trim()
    ? Number(payload.values.employeeCount)
    : null;

  const sessionSnapshot = session ? buildSessionSnapshot(session) : null;
  await ensureSupabaseEnvironmentValidated();
  const submissionsRepo = await getSubmissionsRepository();

  try {
    if (payload.intent === "devis") {
      const { id } = await submissionsRepo.createDevis({
        company: payload.values.company.trim(),
        contactFirstName: payload.values.firstName.trim(),
        contactLastName: payload.values.lastName.trim(),
        email: payload.values.email.trim(),
        phone: payload.values.phone.trim(),
        formationSlug: payload.values.formationSlug,
        formationTitle: formation.shortTitle,
        sessionId: payload.values.sessionId || null,
        sessionSnapshot: sessionSnapshot as Record<string, unknown> | null,
        participantCount: payload.values.participantCount,
        employeeCount,
        onSiteTraining: payload.values.onSiteTraining || null,
        message: payload.values.message.trim() || null,
      });

      await notificationDispatcher.dispatch({
        type: "devis.created",
        payload: { id, formationSlug: payload.values.formationSlug },
      });

      return { ok: true, submissionId: id };
    }

    const { id } = await submissionsRepo.createPreinscription({
      firstName: payload.values.firstName.trim(),
      lastName: payload.values.lastName.trim(),
      email: payload.values.email.trim(),
      phone: payload.values.phone.trim(),
      formationSlug: payload.values.formationSlug,
      formationTitle: formation.shortTitle,
      sessionId: payload.values.sessionId,
      sessionSnapshot: sessionSnapshot as Record<string, unknown> | null,
      cpfFinancing: payload.values.cpfFinancing || null,
      message: payload.values.message.trim() || null,
    });

    await notificationDispatcher.dispatch({
      type: "preinscription.created",
      payload: { id, sessionId: payload.values.sessionId },
    });

    notifyTeamOfFormSubmission({
      kind: "preinscription",
      referenceId: id,
      adminPath: `/admin/preinscriptions/${id}/sheet`,
      replyToEmail: payload.values.email.trim(),
      details: [
        {
          label: "Nom",
          value: `${payload.values.firstName.trim()} ${payload.values.lastName.trim()}`.trim(),
        },
        { label: "Email", value: payload.values.email.trim() },
        { label: "Téléphone", value: payload.values.phone.trim() },
        { label: "Formation", value: formation.shortTitle },
        { label: "Session", value: formatSessionDetail(sessionSnapshot) },
        {
          label: "Financement CPF",
          value: payload.values.cpfFinancing ? CPF_LABELS[payload.values.cpfFinancing] : "—",
        },
        { label: "Message", value: payload.values.message.trim() || "—" },
      ],
    });

    return { ok: true, submissionId: id };
  } catch (error) {
    console.error("[registration:submit]", error);
    return { ok: false, error: "Enregistrement impossible pour le moment." };
  }
}
