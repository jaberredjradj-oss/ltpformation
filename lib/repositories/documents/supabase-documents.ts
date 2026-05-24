import { mapRowToEntityDocument } from "@/lib/db/mappers";
import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import type { EntityDocumentRow } from "@/lib/db/types";
import {
  ensureDocumentsInfrastructure,
  getDocumentsStorageMode,
} from "@/lib/documents/infrastructure";
import {
  createManifestDocument,
  getManifestDocumentById,
  listManifestDocuments,
} from "@/lib/documents/storage-manifest";
import { withUploadTimeout } from "@/lib/documents/upload-timeout";
import type { CreateEntityDocumentInput, EntityDocument } from "@/lib/documents/types";
import type { DocumentsRepository } from "@/lib/repositories/documents/types";

const DB_TIMEOUT_MS = 8000;

function isMissingEntityDocumentsError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("entity_documents") &&
    (lower.includes("schema cache") ||
      lower.includes("does not exist") ||
      lower.includes("could not find the table"))
  );
}

async function listFromTable(
  entityType: EntityDocument["entityType"],
  entityId: string,
): Promise<EntityDocument[]> {
  const client = getSupabaseServerClient();
  if (!client) return [];

  const listQuery = client
    .from("entity_documents")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("uploaded_at", { ascending: false });
  const { data, error } = await withUploadTimeout(listQuery, DB_TIMEOUT_MS, "list entity documents");

  if (error) {
    if (isMissingEntityDocumentsError(error.message)) {
      return listManifestDocuments(entityType, entityId);
    }
    throw new Error(error.message);
  }

  return (data as EntityDocumentRow[]).map(mapRowToEntityDocument);
}

async function getFromTable(id: string): Promise<EntityDocument | null> {
  const client = getSupabaseServerClient();
  if (!client) return null;

  const getQuery = client.from("entity_documents").select("*").eq("id", id).maybeSingle();
  const { data, error } = await withUploadTimeout(getQuery, DB_TIMEOUT_MS, "get entity document");

  if (error) {
    if (isMissingEntityDocumentsError(error.message)) {
      return getManifestDocumentById(id);
    }
    throw new Error(error.message);
  }

  return data ? mapRowToEntityDocument(data as EntityDocumentRow) : null;
}

async function createInTable(input: CreateEntityDocumentInput): Promise<EntityDocument> {
  const client = getSupabaseServerClient();
  if (!client) {
    throw new Error("Supabase non configuré.");
  }

  const createQuery = client
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
  const { data, error } = await withUploadTimeout(createQuery, DB_TIMEOUT_MS, "create entity document");

  if (error) {
    throw new Error(error.message);
  }

  return mapRowToEntityDocument(data as EntityDocumentRow);
}

export const supabaseDocumentsRepository: DocumentsRepository = {
  async listByEntity(entityType, entityId) {
    await ensureDocumentsInfrastructure();
    if (getDocumentsStorageMode() === "manifest") {
      return listManifestDocuments(entityType, entityId);
    }
    return listFromTable(entityType, entityId);
  },

  async getById(id) {
    await ensureDocumentsInfrastructure();
    if (getDocumentsStorageMode() === "manifest") {
      return getManifestDocumentById(id);
    }
    return getFromTable(id);
  },

  async create(input) {
    await ensureDocumentsInfrastructure();
    if (getDocumentsStorageMode() === "manifest") {
      return createManifestDocument(input);
    }

    try {
      return await createInTable(input);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (isMissingEntityDocumentsError(message)) {
        return createManifestDocument(input);
      }
      throw error;
    }
  },
};
