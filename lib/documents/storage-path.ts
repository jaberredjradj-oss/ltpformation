import { ENTITY_DOCUMENT_FOLDERS } from "@/lib/documents/constants";
import { sanitizeFileName } from "@/lib/documents/validation";
import type { EntityDocumentType } from "@/lib/documents/types";

export function buildDocumentStoragePath(
  entityType: EntityDocumentType,
  entityId: string,
  fileName: string,
): string {
  const folder = ENTITY_DOCUMENT_FOLDERS[entityType];
  const safeName = sanitizeFileName(fileName);
  const timestamp = Date.now();
  return `${folder}/${entityId}_${timestamp}_${safeName}`;
}
