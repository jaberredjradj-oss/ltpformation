"use server";

import { revalidatePath } from "next/cache";
import { assertAdminAccess } from "@/lib/admin/auth";
import { processAdminDocumentUpload } from "@/lib/documents/candidate-upload";
import { downloadDocumentBytes } from "@/lib/documents/storage";
import type { EntityDocument, EntityDocumentType } from "@/lib/documents/types";
import { getDocumentsRepository } from "@/lib/repositories";

export type { DocumentUploadResult } from "@/lib/documents/candidate-upload";

function revalidateEntityPaths(entityType: EntityDocumentType) {
  revalidatePath("/admin");
  if (entityType === "preinscription") {
    revalidatePath("/admin/preinscriptions");
  } else if (entityType === "devis") {
    revalidatePath("/admin/demandes");
  }
}

export async function listEntityDocuments(
  entityType: EntityDocumentType,
  entityId: string,
): Promise<EntityDocument[]> {
  await assertAdminAccess();
  const repo = await getDocumentsRepository();
  return repo.listByEntity(entityType, entityId);
}

export async function uploadAdminDocuments(
  formData: FormData,
): Promise<import("@/lib/documents/candidate-upload").DocumentUploadResult> {
  await assertAdminAccess();

  const entityType = formData.get("entityType") as EntityDocumentType | null;
  const result = await processAdminDocumentUpload(formData);

  if (result.ok && entityType) {
    revalidateEntityPaths(entityType);
  }

  return result;
}

export async function getDocumentForDownload(
  documentId: string,
): Promise<{ document: EntityDocument; bytes: Buffer } | null> {
  await assertAdminAccess();

  const repo = await getDocumentsRepository();
  const document = await repo.getById(documentId);
  if (!document) return null;

  const bytes = await downloadDocumentBytes(document.storagePath);

  return { document, bytes };
}
