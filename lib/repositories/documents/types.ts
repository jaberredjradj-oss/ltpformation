import type { CreateEntityDocumentInput, EntityDocument } from "@/lib/documents/types";

export interface DocumentsRepository {
  listByEntity(
    entityType: EntityDocument["entityType"],
    entityId: string,
  ): Promise<EntityDocument[]>;
  getById(id: string): Promise<EntityDocument | null>;
  create(input: CreateEntityDocumentInput): Promise<EntityDocument>;
}
