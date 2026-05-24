"use server";

import { revalidatePath } from "next/cache";
import { assertAdminAccess } from "@/lib/admin/auth";
import { buildDocumentStoragePath } from "@/lib/documents/storage-path";
import { downloadDocumentBytes, uploadDocumentBytes } from "@/lib/documents/storage";
import type {
  DocumentKind,
  DocumentUploadEntry,
  EntityDocument,
  EntityDocumentType,
} from "@/lib/documents/types";
import { validateDocumentBatch } from "@/lib/documents/validation";
import { getDocumentsRepository, getSubmissionsRepository } from "@/lib/repositories";

export type DocumentUploadResult =
  | { ok: true; uploadedCount: number }
  | { ok: false; error: string };

const VALID_DOCUMENT_KINDS = new Set<DocumentKind>([
  "identity",
  "medical_certificate",
  "first_aid",
  "cv",
  "cpf_proof",
  "residence_permit",
  "other",
  "admin",
]);

function parseDocumentKind(value: string, uploadedBy: "candidate" | "admin"): DocumentKind {
  if (VALID_DOCUMENT_KINDS.has(value as DocumentKind)) {
    return value as DocumentKind;
  }
  return uploadedBy === "admin" ? "admin" : "other";
}

function parseUploadEntries(formData: FormData, uploadedBy: "candidate" | "admin"): DocumentUploadEntry[] {
  const files = formData.getAll("files").filter((entry): entry is File => entry instanceof File);
  const kinds = formData.getAll("documentKinds").map((entry) => entry.toString());

  return files.map((file, index) => ({
    file,
    documentKind: parseDocumentKind(kinds[index] ?? "other", uploadedBy),
  }));
}

async function verifyEntityOwnership(
  entityType: EntityDocumentType,
  entityId: string,
  email?: string,
): Promise<boolean> {
  const repo = await getSubmissionsRepository();

  if (entityType === "preinscription") {
    const items = await repo.listPreinscriptions();
    const item = items.find((entry) => entry.id === entityId);
    if (!item) return false;
    if (email && item.email.toLowerCase() !== email.trim().toLowerCase()) return false;
    return true;
  }

  if (entityType === "devis") {
    const items = await repo.listDevisRequests();
    const item = items.find((entry) => entry.id === entityId);
    if (!item) return false;
    if (email && item.email.toLowerCase() !== email.trim().toLowerCase()) return false;
    return true;
  }

  return false;
}

function revalidateEntityPaths(entityType: EntityDocumentType) {
  revalidatePath("/admin");
  if (entityType === "preinscription") {
    revalidatePath("/admin/preinscriptions");
  } else if (entityType === "devis") {
    revalidatePath("/admin/demandes");
  }
}

async function persistFiles(
  entityType: EntityDocumentType,
  entityId: string,
  entries: DocumentUploadEntry[],
  uploadedBy: "candidate" | "admin",
): Promise<number> {
  if (entries.length === 0) {
    return 0;
  }

  const batchError = validateDocumentBatch(
    entries.map(({ file }) => ({ name: file.name, type: file.type, size: file.size })),
  );

  if (batchError) {
    throw new Error(batchError);
  }

  const documentsRepo = await getDocumentsRepository();
  let count = 0;

  for (const { file, documentKind } of entries) {
    const storagePath = buildDocumentStoragePath(entityType, entityId, file.name);
    const bytes = Buffer.from(await file.arrayBuffer());

    await uploadDocumentBytes(storagePath, bytes, file.type || "application/octet-stream");

    await documentsRepo.create({
      entityType,
      entityId,
      documentKind,
      fileName: file.name,
      storagePath,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      uploadedBy,
    });

    count += 1;
  }

  return count;
}

export async function listEntityDocuments(
  entityType: EntityDocumentType,
  entityId: string,
): Promise<EntityDocument[]> {
  await assertAdminAccess();
  const repo = await getDocumentsRepository();
  return repo.listByEntity(entityType, entityId);
}

export async function uploadCandidateDocuments(formData: FormData): Promise<DocumentUploadResult> {
  const entityType = formData.get("entityType") as EntityDocumentType | null;
  const entityId = formData.get("entityId")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const entries = parseUploadEntries(formData, "candidate");

  if (!entityType || !entityId) {
    return { ok: false, error: "Référence de dossier invalide." };
  }

  if (entityType !== "preinscription" && entityType !== "devis") {
    return { ok: false, error: "Type de dossier non supporté." };
  }

  if (entries.length === 0) {
    return { ok: true, uploadedCount: 0 };
  }

  const ownsEntity = await verifyEntityOwnership(entityType, entityId, email);
  if (!ownsEntity) {
    return { ok: false, error: "Dossier introuvable ou email non correspondant." };
  }

  try {
    const uploadedCount = await persistFiles(entityType, entityId, entries, "candidate");
    revalidateEntityPaths(entityType);
    return { ok: true, uploadedCount };
  } catch (error) {
    console.error("[documents:candidate-upload]", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Envoi de fichiers impossible.",
    };
  }
}

export async function uploadAdminDocuments(formData: FormData): Promise<DocumentUploadResult> {
  await assertAdminAccess();

  const entityType = formData.get("entityType") as EntityDocumentType | null;
  const entityId = formData.get("entityId")?.toString() ?? "";
  const entries = parseUploadEntries(formData, "admin").map((entry) => ({
    ...entry,
    documentKind: "admin" as const,
  }));

  if (!entityType || !entityId) {
    return { ok: false, error: "Référence de dossier invalide." };
  }

  if (entries.length === 0) {
    return { ok: false, error: "Aucun fichier sélectionné." };
  }

  const ownsEntity = await verifyEntityOwnership(entityType, entityId);
  if (!ownsEntity) {
    return { ok: false, error: "Dossier introuvable." };
  }

  try {
    const uploadedCount = await persistFiles(entityType, entityId, entries, "admin");
    revalidateEntityPaths(entityType);
    return { ok: true, uploadedCount };
  } catch (error) {
    console.error("[documents:admin-upload]", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Envoi de fichiers impossible.",
    };
  }
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
