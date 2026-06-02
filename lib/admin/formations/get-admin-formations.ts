import { loadManagedFormations } from "@/lib/repositories/formations";
import type { AdminFormationRow } from "@/lib/admin/formations/types";

/**
 * Admin list source. Includes inactive (hidden) formations so the client can
 * see and re-activate them. Falls back to the static catalog when the overlay
 * is unavailable (same guarantee as the public loader).
 */
export async function getAdminFormationRows(): Promise<AdminFormationRow[]> {
  const managed = await loadManagedFormations({ includeInactive: true });

  return managed
    .map((item): AdminFormationRow => {
      const f = item.formation;
      return {
        slug: f.slug,
        title: f.title,
        shortTitle: f.shortTitle,
        category: f.category,
        categoryLabel: f.categoryLabel,
        type: f.type,
        typeLabel: f.typeLabel,
        level: f.level,
        durationLabel: f.durationLabel,
        durationHours: f.durationHours,
        priceLabel: f.price.label,
        priceAmount: f.price.amount,
        cpfEligible: f.cpfEligible,
        active: item.active,
        source: item.source,
        sortOrder: item.sortOrder,
        updatedAt: item.updatedAt,
      };
    })
    .sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return a.title.localeCompare(b.title, "fr");
    });
}
