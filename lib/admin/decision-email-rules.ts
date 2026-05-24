import type { DevisRequestStatus, PreinscriptionStatus } from "@/lib/admin/types";
import type { DecisionEmailKind } from "@/lib/email/types";

export function isEmailTriggeringPreinscriptionStatus(status: PreinscriptionStatus): boolean {
  return status === "validated" || status === "refused";
}

export function isEmailTriggeringDevisStatus(status: DevisRequestStatus): boolean {
  return status === "contacted" || status === "processed";
}

export function preinscriptionStatusToEmailKind(
  status: PreinscriptionStatus,
): DecisionEmailKind | null {
  if (status === "validated") return "preinscription.accepted";
  if (status === "refused") return "preinscription.refused";
  return null;
}

export function devisStatusToEmailKind(status: DevisRequestStatus): DecisionEmailKind | null {
  if (status === "contacted" || status === "processed") return "devis.followup";
  return null;
}

export function decisionEmailKindToNotificationType(kind: DecisionEmailKind): string {
  return kind;
}
