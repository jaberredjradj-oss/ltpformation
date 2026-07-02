import { TRASH_RETENTION_DAYS } from "@/lib/admin/constants";
import type { AdminTrashedItem, TrashEntityType } from "@/lib/admin/types";
import { purgeStaticDocumentsForEntities } from "@/lib/repositories/documents/static-documents";
import {
  listStaticTrashedMessages,
  purgeStaticMessage,
  restoreStaticMessage,
  softDeleteStaticMessage,
} from "@/lib/repositories/messages/static-messages";
import {
  listStaticTrashedDevis,
  listStaticTrashedPreinscriptions,
  purgeStaticDevis,
  purgeStaticPreinscription,
  restoreStaticDevis,
  restoreStaticPreinscription,
  softDeleteStaticDevis,
  softDeleteStaticPreinscription,
} from "@/lib/repositories/submissions/static-submissions";
import type { TrashRepository } from "@/lib/repositories/trash/types";

function excerpt(text: string, max = 80): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export const staticTrashRepository: TrashRepository = {
  async listTrashedItems() {
    const items: AdminTrashedItem[] = [
      ...listStaticTrashedPreinscriptions().map((item) => ({
        entityType: "preinscription" as const,
        id: item.id,
        primaryLabel: `${item.firstName} ${item.lastName}`.trim(),
        secondaryLabel: item.formationTitle,
        email: item.email,
        deletedAt: item.deletedAt ?? "",
        deleteExpiresAt: item.deleteExpiresAt ?? "",
      })),
      ...listStaticTrashedDevis().map((item) => ({
        entityType: "devis" as const,
        id: item.id,
        primaryLabel: item.company,
        secondaryLabel: item.contactName || item.formationTitle,
        email: item.email,
        deletedAt: item.deletedAt ?? "",
        deleteExpiresAt: item.deleteExpiresAt ?? "",
      })),
      ...listStaticTrashedMessages().map((item) => ({
        entityType: "message" as const,
        id: item.id,
        primaryLabel: `${item.firstName} ${item.lastName}`.trim(),
        secondaryLabel: excerpt(item.message),
        email: item.email,
        deletedAt: item.deletedAt ?? "",
        deleteExpiresAt: item.deleteExpiresAt ?? "",
      })),
    ];

    return items.sort(
      (a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime(),
    );
  },

  async softDelete(entityType: TrashEntityType, id) {
    const deletedAt = new Date().toISOString();
    const deleteExpiresAt = new Date(
      Date.now() + TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString();

    if (entityType === "preinscription") {
      softDeleteStaticPreinscription(id, deletedAt, deleteExpiresAt);
    } else if (entityType === "devis") {
      softDeleteStaticDevis(id, deletedAt, deleteExpiresAt);
    } else {
      softDeleteStaticMessage(id, deletedAt, deleteExpiresAt);
    }
  },

  async restore(entityType: TrashEntityType, id) {
    if (entityType === "preinscription") {
      restoreStaticPreinscription(id);
    } else if (entityType === "devis") {
      restoreStaticDevis(id);
    } else {
      restoreStaticMessage(id);
    }
  },

  async purge(entityType: TrashEntityType, id) {
    let purged = false;
    if (entityType === "preinscription") {
      purged = purgeStaticPreinscription(id);
    } else if (entityType === "devis") {
      purged = purgeStaticDevis(id);
    } else {
      purged = purgeStaticMessage(id);
    }

    if (purged) {
      purgeStaticDocumentsForEntities(entityType, [id]);
    }
  },
};
