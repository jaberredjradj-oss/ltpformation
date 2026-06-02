import { FORMATIONS_BY_SLUG } from "@/lib/formations/catalog";
import { getSubmissionsRepository, loadPlanningSessions } from "@/lib/repositories";
import { getFormationsRepository } from "@/lib/repositories/formations";

export interface FormationReferences {
  slug: string;
  /** Slug defined in the immutable static catalog (code-defined). */
  isStatic: boolean;
  /** A DB overlay row exists for this slug. */
  hasDbRow: boolean;
  /** DB row created from scratch in the admin (source "admin"). */
  isAdminCreated: boolean;
  planningCount: number;
  preinscriptionCount: number;
  devisCount: number;
  /** Safe to hard-delete: admin-created, not static, zero references. */
  canHardDelete: boolean;
}

/**
 * Gather everything needed to decide between a hard delete and a soft-delete
 * (deactivate). A static formation can never be hard-deleted (it lives in
 * code); an admin-created one can only be hard-deleted when nothing references
 * its slug (planning sessions, preinscriptions, devis). Every lookup is
 * defensive: a missing table degrades to a count of 0.
 */
export async function getFormationReferences(slug: string): Promise<FormationReferences> {
  const isStatic = FORMATIONS_BY_SLUG.has(slug);

  let hasDbRow = false;
  let isAdminCreated = false;
  try {
    const managed = await getFormationsRepository().getBySlug(slug);
    hasDbRow = Boolean(managed);
    isAdminCreated = managed?.source === "admin";
  } catch {
    // Table missing / Supabase down — treat as no DB row.
  }

  let planningCount = 0;
  try {
    const sessions = await loadPlanningSessions();
    planningCount = sessions.filter((session) => session.formationSlug === slug).length;
  } catch {
    // Ignore — no planning data available.
  }

  let preinscriptionCount = 0;
  let devisCount = 0;
  try {
    const repository = await getSubmissionsRepository();
    const [preinscriptions, devis] = await Promise.all([
      repository.listPreinscriptions(),
      repository.listDevisRequests(),
    ]);
    preinscriptionCount = preinscriptions.filter((item) => item.formationSlug === slug).length;
    devisCount = devis.filter((item) => item.formationSlug === slug).length;
  } catch {
    // Ignore — no submission data available.
  }

  const referenced = planningCount + preinscriptionCount + devisCount > 0;
  const canHardDelete = !isStatic && isAdminCreated && !referenced;

  return {
    slug,
    isStatic,
    hasDbRow,
    isAdminCreated,
    planningCount,
    preinscriptionCount,
    devisCount,
    canHardDelete,
  };
}
