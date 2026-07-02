import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import { DOCUMENTS_BUCKET } from "@/lib/documents/constants";
import type { AdminTrashedItem, TrashEntityType } from "@/lib/admin/types";
import type { TrashRepository } from "@/lib/repositories/trash/types";

interface TrashedPreinscriptionRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  formation_title: string;
  deleted_at: string;
  delete_expires_at: string;
}

interface TrashedDevisRow {
  id: string;
  company: string;
  contact_first_name: string;
  contact_last_name: string;
  email: string;
  formation_title: string;
  deleted_at: string;
  delete_expires_at: string;
}

interface TrashedMessageRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  message: string;
  deleted_at: string;
  delete_expires_at: string;
}

/** Migration 007 pas encore appliquée → corbeille vide plutôt qu'une erreur. */
function isMissingTrashColumnError(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("deleted_at") && (lower.includes("does not exist") || lower.includes("schema cache"));
}

function excerpt(text: string, max = 80): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

const RPC_BY_OPERATION = {
  softDelete: "trash_soft_delete_entity",
  restore: "trash_restore_entity",
} as const;

async function callEntityRpc(
  fn: (typeof RPC_BY_OPERATION)[keyof typeof RPC_BY_OPERATION],
  entityType: TrashEntityType,
  id: string,
): Promise<void> {
  const client = getSupabaseServerClient();
  if (!client) throw new Error("Supabase client unavailable.");

  const { error } = await client.rpc(fn, { p_entity_type: entityType, p_entity_id: id });
  if (error) throw error;
}

export const supabaseTrashRepository: TrashRepository = {
  async listTrashedItems() {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const [preResult, devisResult, msgResult] = await Promise.all([
      client
        .from("preinscriptions")
        .select("id,first_name,last_name,email,formation_title,deleted_at,delete_expires_at")
        .not("deleted_at", "is", null),
      client
        .from("devis_requests")
        .select(
          "id,company,contact_first_name,contact_last_name,email,formation_title,deleted_at,delete_expires_at",
        )
        .not("deleted_at", "is", null),
      client
        .from("contact_messages")
        .select("id,first_name,last_name,email,message,deleted_at,delete_expires_at")
        .not("deleted_at", "is", null),
    ]);

    for (const result of [preResult, devisResult, msgResult]) {
      if (result.error) {
        if (isMissingTrashColumnError(result.error.message)) return [];
        throw result.error;
      }
    }

    const items: AdminTrashedItem[] = [
      ...((preResult.data ?? []) as TrashedPreinscriptionRow[]).map((row) => ({
        entityType: "preinscription" as const,
        id: row.id,
        primaryLabel: `${row.first_name} ${row.last_name}`.trim(),
        secondaryLabel: row.formation_title,
        email: row.email,
        deletedAt: row.deleted_at,
        deleteExpiresAt: row.delete_expires_at,
      })),
      ...((devisResult.data ?? []) as TrashedDevisRow[]).map((row) => ({
        entityType: "devis" as const,
        id: row.id,
        primaryLabel: row.company,
        secondaryLabel:
          `${row.contact_first_name} ${row.contact_last_name}`.trim() || row.formation_title,
        email: row.email,
        deletedAt: row.deleted_at,
        deleteExpiresAt: row.delete_expires_at,
      })),
      ...((msgResult.data ?? []) as TrashedMessageRow[]).map((row) => ({
        entityType: "message" as const,
        id: row.id,
        primaryLabel: `${row.first_name} ${row.last_name}`.trim(),
        secondaryLabel: excerpt(row.message),
        email: row.email,
        deletedAt: row.deleted_at,
        deleteExpiresAt: row.delete_expires_at,
      })),
    ];

    return items.sort(
      (a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime(),
    );
  },

  async softDelete(entityType, id) {
    await callEntityRpc(RPC_BY_OPERATION.softDelete, entityType, id);
  },

  async restore(entityType, id) {
    await callEntityRpc(RPC_BY_OPERATION.restore, entityType, id);
  },

  async purge(entityType, id) {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    // La fonction SQL supprime l'enregistrement + ses documents dans UNE
    // transaction et retourne les chemins des fichiers à nettoyer dans le bucket.
    const { data, error } = await client.rpc("trash_purge_entity", {
      p_entity_type: entityType,
      p_entity_id: id,
    });
    if (error) throw error;

    const storagePaths = ((data ?? []) as string[]).filter(Boolean);
    if (storagePaths.length > 0) {
      // Nettoyage du bucket best effort : les métadonnées sont déjà purgées.
      await client.storage.from(DOCUMENTS_BUCKET).remove(storagePaths);
    }
  },
};
