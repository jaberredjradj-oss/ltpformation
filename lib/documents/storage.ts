import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { DOCUMENTS_BUCKET, MAX_DOCUMENT_SIZE_ERROR } from "@/lib/documents/constants";
import { ensureDocumentsInfrastructure } from "@/lib/documents/infrastructure";
import { withUploadTimeout } from "@/lib/documents/upload-timeout";
import { isRealDataEnabled } from "@/lib/db/env";
import { getSupabaseServerClient } from "@/lib/db/supabase-server";

const LOCAL_UPLOAD_ROOT = path.join(process.cwd(), ".data", "uploads");
const STORAGE_UPLOAD_TIMEOUT_MS = 15000;

async function ensureLocalDir(storagePath: string): Promise<string> {
  const fullPath = path.join(LOCAL_UPLOAD_ROOT, storagePath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  return fullPath;
}

function mapStorageError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("bucket not found")) {
    return "Le stockage des documents n'est pas configuré.";
  }

  if (lower.includes("payload too large") || lower.includes("entity too large")) {
    return MAX_DOCUMENT_SIZE_ERROR;
  }

  if (lower.includes("already exists") || lower.includes("duplicate")) {
    return "Ce fichier existe déjà.";
  }

  if (lower.includes("timed out")) {
    return "L'envoi du fichier a expiré. Réessayez.";
  }

  return "Impossible d'enregistrer le fichier pour le moment.";
}

async function uploadToSupabase(
  storagePath: string,
  bytes: Buffer,
  mimeType: string,
): Promise<void> {
  const client = getSupabaseServerClient();
  if (!client) {
    throw new Error("Configuration serveur incomplète.");
  }

  const { error } = await client.storage.from(DOCUMENTS_BUCKET).upload(storagePath, bytes, {
    contentType: mimeType,
    upsert: false,
  });

  if (error) {
    throw new Error(mapStorageError(error.message));
  }
}

export async function uploadDocumentBytes(
  storagePath: string,
  bytes: Buffer,
  mimeType: string,
): Promise<void> {
  if (isRealDataEnabled()) {
    await ensureDocumentsInfrastructure();

    await withUploadTimeout(
      uploadToSupabase(storagePath, bytes, mimeType),
      STORAGE_UPLOAD_TIMEOUT_MS,
      "Supabase storage upload",
    );
    return;
  }

  const fullPath = await ensureLocalDir(storagePath);
  await writeFile(fullPath, bytes);
}

export async function deleteDocumentBytes(storagePath: string): Promise<void> {
  if (isRealDataEnabled()) {
    const client = getSupabaseServerClient();
    if (!client) return;
    await client.storage.from(DOCUMENTS_BUCKET).remove([storagePath]);
    return;
  }

  const fullPath = path.join(LOCAL_UPLOAD_ROOT, storagePath);
  await unlink(fullPath).catch(() => undefined);
}

export async function downloadDocumentBytes(storagePath: string): Promise<Buffer> {
  if (isRealDataEnabled()) {
    await ensureDocumentsInfrastructure();

    const client = getSupabaseServerClient();
    if (!client) {
      throw new Error("Supabase non configuré.");
    }

    const { data, error } = await client.storage.from(DOCUMENTS_BUCKET).download(storagePath);

    if (error || !data) {
      throw new Error(error?.message ?? "Fichier introuvable.");
    }

    return Buffer.from(await data.arrayBuffer());
  }

  const fullPath = path.join(LOCAL_UPLOAD_ROOT, storagePath);
  return readFile(fullPath);
}
