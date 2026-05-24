import { randomUUID } from "node:crypto";
import type { CreateEntityDocumentInput, EntityDocument } from "@/lib/documents/types";
import type { DocumentsRepository } from "@/lib/repositories/documents/types";

const store: EntityDocument[] = [];

export const staticDocumentsRepository: DocumentsRepository = {
  async listByEntity(entityType, entityId) {
    return store
      .filter((doc) => doc.entityType === entityType && doc.entityId === entityId)
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  },

  async getById(id) {
    return store.find((doc) => doc.id === id) ?? null;
  },

  async create(input: CreateEntityDocumentInput) {
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

    store.push(document);
    return document;
  },
};
