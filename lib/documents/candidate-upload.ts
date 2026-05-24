import { buildDocumentStoragePath } from "@/lib/documents/storage-path";
import { deleteDocumentBytes, uploadDocumentBytes } from "@/lib/documents/storage";
import type { DocumentKind, EntityDocumentType } from "@/lib/documents/types";
import {
  resolveDocumentMimeType,
  validateDocumentFile,
} from "@/lib/documents/validation";
import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import { isRealDataEnabled } from "@/lib/db/env";
import { getDocumentsRepository, getSubmissionsRepository } from "@/lib/repositories";

export type DocumentUploadResult =
  | { ok: true; uploadedCount: number }
  | { ok: false; error: string };

const VALID_KINDS = new Set<DocumentKind>([
  "identity",
  "medical_certificate",
  "first_aid",
  "cv",
  "cpf_proof",
  "residence_permit",
  "other",
  "admin",
]);

function parseKind(value: string, uploadedBy: "candidate" | "admin"): DocumentKind {
  if (VALID_KINDS.has(value as DocumentKind)) return value as DocumentKind;
  return uploadedBy === "admin" ? "admin" : "other";
}

function isFileLike(entry: FormDataEntryValue): entry is File {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "arrayBuffer" in entry &&
    typeof (entry as File).arrayBuffer === "function" &&
    typeof (entry as File).name === "string"
  );
}

function parseFiles(formData: FormData, uploadedBy: "candidate" | "admin") {
  const raw = formData.getAll("files");
  const kinds = formData.getAll("documentKinds").map(String);

  return raw.filter(isFileLike).map((file, index) => ({
    file,
    documentKind: parseKind(kinds[index] ?? "other", uploadedBy),
  }));
}

function mapPersistError(error: unknown): string {
  const message = error instanceof Error ? error.message : "Envoi de fichiers impossible.";

  if (message.includes("entity_documents") && message.includes("schema cache")) {
    return "Impossible d'enregistrer les documents pour le moment.";
  }

  return message;
}

async function verifyOwnership(
  entityType: EntityDocumentType,
  entityId: string,
  email?: string,
): Promise<boolean> {
  if (isRealDataEnabled()) {
    const client = getSupabaseServerClient();
    if (!client) return false;

    const table = entityType === "preinscription" ? "preinscriptions" : "devis_requests";
    const { data, error } = await client
      .from(table)
      .select("email")
      .eq("id", entityId)
      .maybeSingle();

    if (error || !data?.email) return false;
    if (email && data.email.toLowerCase() !== email.trim().toLowerCase()) return false;
    return true;
  }

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

async function persistOneFile(
  entityType: EntityDocumentType,
  entityId: string,
  file: File,
  documentKind: DocumentKind,
  uploadedBy: "candidate" | "admin",
): Promise<void> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const sizeBytes = bytes.length;

  const validationError = validateDocumentFile({
    name: file.name,
    type: file.type,
    size: sizeBytes,
  });

  if (validationError) {
    throw new Error(validationError);
  }

  const mimeType = resolveDocumentMimeType(file.name, file.type);
  const storagePath = buildDocumentStoragePath(entityType, entityId, file.name);

  await uploadDocumentBytes(storagePath, bytes, mimeType);

  try {
    const documentsRepo = await getDocumentsRepository();
    await documentsRepo.create({
      entityType,
      entityId,
      documentKind,
      fileName: file.name,
      storagePath,
      mimeType,
      sizeBytes,
      uploadedBy,
    });
  } catch (error) {
    await deleteDocumentBytes(storagePath);
    throw error;
  }
}

export async function processCandidateDocumentUpload(
  formData: FormData,
): Promise<DocumentUploadResult> {
  const entityType = formData.get("entityType") as EntityDocumentType | null;
  const entityId = formData.get("entityId")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const expected = Number.parseInt(formData.get("expectedFileCount")?.toString() ?? "0", 10);
  const files = parseFiles(formData, "candidate");

  if (!entityType || !entityId) {
    return { ok: false, error: "Référence de dossier invalide." };
  }

  if (entityType !== "preinscription" && entityType !== "devis") {
    return { ok: false, error: "Type de dossier non supporté." };
  }

  if (files.length === 0) {
    if (expected > 0) {
      return {
        ok: false,
        error:
          "Les fichiers n'ont pas pu être envoyés. Vérifiez la taille (2 Mo max par fichier) et réessayez.",
      };
    }
    return { ok: true, uploadedCount: 0 };
  }

  if (expected > 0 && files.length !== expected) {
    return {
      ok: false,
      error: `Envoi incomplet (${files.length}/${expected} fichier(s) reçu(s)). Réessayez.`,
    };
  }

  if (!(await verifyOwnership(entityType, entityId, email))) {
    return { ok: false, error: "Dossier introuvable ou email non correspondant." };
  }

  try {
    for (const { file, documentKind } of files) {
      await persistOneFile(entityType, entityId, file, documentKind, "candidate");
    }
    return { ok: true, uploadedCount: files.length };
  } catch (error) {
    console.error("[documents:upload]", error);
    return { ok: false, error: mapPersistError(error) };
  }
}

export async function processAdminDocumentUpload(
  formData: FormData,
): Promise<DocumentUploadResult> {
  const entityType = formData.get("entityType") as EntityDocumentType | null;
  const entityId = formData.get("entityId")?.toString().trim() ?? "";
  const files = parseFiles(formData, "admin").map((entry) => ({
    ...entry,
    documentKind: "admin" as const,
  }));

  if (!entityType || !entityId) {
    return { ok: false, error: "Référence de dossier invalide." };
  }

  if (files.length === 0) {
    return { ok: false, error: "Aucun fichier sélectionné." };
  }

  if (!(await verifyOwnership(entityType, entityId))) {
    return { ok: false, error: "Dossier introuvable." };
  }

  try {
    for (const { file, documentKind } of files) {
      await persistOneFile(entityType, entityId, file, documentKind, "admin");
    }
    return { ok: true, uploadedCount: files.length };
  } catch (error) {
    console.error("[documents:admin-upload]", error);
    return { ok: false, error: mapPersistError(error) };
  }
}
