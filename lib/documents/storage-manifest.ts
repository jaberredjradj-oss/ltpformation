import { randomUUID } from "node:crypto";
import { DOCUMENTS_BUCKET } from "@/lib/documents/constants";
import type { CreateEntityDocumentInput, EntityDocument } from "@/lib/documents/types";
import { getSupabaseServerClient } from "@/lib/db/supabase-server";

const DOCUMENT_META_PREFIX = "_meta/documents";
const ENTITY_INDEX_PREFIX = "_meta/entities";

function documentMetaPath(id: string): string {
  return `${DOCUMENT_META_PREFIX}/${id}.json`;
}

function entityIndexPath(entityType: string, entityId: string): string {
  return `${ENTITY_INDEX_PREFIX}/${entityType}/${entityId}.json`;
}

async function readJson<T>(storagePath: string): Promise<T | null> {
  const client = getSupabaseServerClient();
  if (!client) return null;

  const { data, error } = await client.storage.from(DOCUMENTS_BUCKET).download(storagePath);
  if (error || !data) return null;

  try {
    return JSON.parse(await data.text()) as T;
  } catch {
    return null;
  }
}

async function writeJson(storagePath: string, payload: unknown): Promise<void> {
  const client = getSupabaseServerClient();
  if (!client) {
    throw new Error("Supabase non configuré.");
  }

  const bytes = Buffer.from(JSON.stringify(payload), "utf8");
  const { error } = await client.storage.from(DOCUMENTS_BUCKET).upload(storagePath, bytes, {
    contentType: "application/json",
    upsert: true,
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function readEntityDocumentIds(
  entityType: string,
  entityId: string,
): Promise<string[]> {
  const index = await readJson<{ documentIds?: string[] }>(
    entityIndexPath(entityType, entityId),
  );
  return index?.documentIds ?? [];
}

async function writeEntityDocumentIds(
  entityType: string,
  entityId: string,
  documentIds: string[],
): Promise<void> {
  await writeJson(entityIndexPath(entityType, entityId), { documentIds });
}

export async function listManifestDocuments(
  entityType: EntityDocument["entityType"],
  entityId: string,
): Promise<EntityDocument[]> {
  const ids = await readEntityDocumentIds(entityType, entityId);
  const documents: EntityDocument[] = [];

  for (const id of ids) {
    const document = await readJson<EntityDocument>(documentMetaPath(id));
    if (document) documents.push(document);
  }

  return documents.sort(
    (left, right) =>
      new Date(right.uploadedAt).getTime() - new Date(left.uploadedAt).getTime(),
  );
}

export async function getManifestDocumentById(id: string): Promise<EntityDocument | null> {
  return readJson<EntityDocument>(documentMetaPath(id));
}

export async function createManifestDocument(
  input: CreateEntityDocumentInput,
): Promise<EntityDocument> {
  const document: EntityDocument = {
    id: randomUUID(),
    entityType: input.entityType,
    entityId: input.entityId,
    documentKind: input.documentKind,
    fileName: input.fileName,
    storagePath: input.storagePath,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    uploadedBy: input.uploadedBy,
    uploadedAt: new Date().toISOString(),
  };

  await writeJson(documentMetaPath(document.id), document);

  const ids = await readEntityDocumentIds(input.entityType, input.entityId);
  if (!ids.includes(document.id)) {
    ids.push(document.id);
    await writeEntityDocumentIds(input.entityType, input.entityId, ids);
  }

  return document;
}

export async function deleteManifestDocumentMeta(document: EntityDocument): Promise<void> {
  const client = getSupabaseServerClient();
  if (!client) return;

  await client.storage.from(DOCUMENTS_BUCKET).remove([documentMetaPath(document.id)]);

  const ids = await readEntityDocumentIds(document.entityType, document.entityId);
  const nextIds = ids.filter((id) => id !== document.id);
  await writeEntityDocumentIds(document.entityType, document.entityId, nextIds);
}
