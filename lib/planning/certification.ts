import { getFormation } from "@/lib/formations/catalog";
import type { PlanningSession } from "@/lib/planning/types";

/**
 * Code de certification à afficher pour une session.
 *
 * Le catalogue des formations est la source de vérité : un code RNCP
 * appartient au titre, pas à un créneau de dates. Or chaque session en porte
 * une copie en base (`certification_code`), renseignée à la création — ces
 * copies ne bougent pas lorsque France compétences renumérote un titre, et
 * le planning se met alors à annoncer un code périmé.
 *
 * On privilégie donc le code de la formation rattachée. La valeur stockée sert
 * de repli pour les sessions sans formation au catalogue (saisie libre depuis
 * l'admin), qui restent affichées telles quelles.
 */
export function resolveSessionCertificationCode(
  session: Pick<PlanningSession, "formationSlug" | "certificationCode">,
): string | null {
  const catalogCode = session.formationSlug
    ? getFormation(session.formationSlug)?.certificationCode
    : undefined;

  return catalogCode ?? session.certificationCode;
}
