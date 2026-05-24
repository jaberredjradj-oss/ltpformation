import { mapRowToEntityDocument } from "@/lib/db/mappers";
import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import type { EntityDocumentRow } from "@/lib/db/types";
import type { CreateEntityDocumentInput, EntityDocument } from "@/lib/documents/types";
import type { DocumentsRepository } from "@/lib/repositories/documents/types";

export const supabaseDocumentsRepository: DocumentsRepository = {
  async listByEntity(entityType, entityId) {
    const client = getSupabaseServerClient();
    if (!client) return [];

    const { data, error } = await client
      .from("entity_documents")
      .select("*")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("uploaded_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data as EntityDocumentRow[]).map(mapRowToEntityDocument);
  },

  async getById(id) {
    const client = getSupabaseServerClient();
    if (!client) return null;

    const { data, error } = await client
      .from("entity_documents")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data ? mapRowToEntityDocument(data as EntityDocumentRow) : null;
  },

  async create(input) {
    const client = getSupabaseServerClient();
    if (!client) {
      throw new Error("Supabase non configuré.");
    }

    const { data, error } = await client
      .from("entity_documents")
      .insert({
        entity_type: input.entityType,
        entity_id: input.entityId,
        file_name: input.fileName,
        document_kind: input.documentKind,
        storage_path: input.storagePath,
        mime_type: input.mimeType,
        size_bytes: input.sizeBytes,
        uploaded_by: input.uploadedBy,
      })
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapRowToEntityDocument(data as EntityDocumentRow);
  },
};
