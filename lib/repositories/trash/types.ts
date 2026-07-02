import type { AdminTrashedItem, TrashEntityType } from "@/lib/admin/types";

/**
 * Corbeille admin — suppression logique par enregistrement, avec délai de
 * grâce de 7 jours. Couvre les pré-inscriptions, devis et messages ; les
 * documents rattachés suivent le sort de leur entité.
 */
export interface TrashRepository {
  listTrashedItems(): Promise<AdminTrashedItem[]>;
  softDelete(entityType: TrashEntityType, id: string): Promise<void>;
  restore(entityType: TrashEntityType, id: string): Promise<void>;
  purge(entityType: TrashEntityType, id: string): Promise<void>;
}
