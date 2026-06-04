import type { Formation } from "@/lib/formations/types";

export const FORMATION_PEDAGOGICAL_MODE = "Présentiel";

/** Hours-only label for catalogue and detail pages (e.g. 70h). */
export function formatFormationDurationHours(hours: number): string {
  return `${hours}h`;
}

/** Compact euro price without TTC / per-participant wording (e.g. 1 200 €). */
export function formatFormationPriceEuro(formation: Formation): string {
  const formatted = formation.price.amount.toLocaleString("fr-FR", {
    maximumFractionDigits: 0,
  });
  return `${formatted} €`;
}
