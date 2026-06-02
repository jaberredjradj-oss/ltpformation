import { randomUUID } from "node:crypto";
import { isRealDataEnabled } from "@/lib/db/env";
import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import { withUploadTimeout } from "@/lib/documents/upload-timeout";
import {
  ALLOWED_PDF_MIME_TYPES,
  FORMATION_PDF_BUCKET,
  MAX_PDF_BYTES,
  MAX_PDF_ERROR,
} from "@/lib/admin/formations/pdf-constants";

const STORAGE_TIMEOUT_MS = 20000;

export interface UploadedFormationPdf {
  url: string;
  filename: string;
}

function mapStorageError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("bucket not found")) {
    return "Le stockage des PDF n'est pas configuré.";
  }
  if (lower.includes("payload too large") || lower.includes("entity too large")) {
    return MAX_PDF_ERROR;
  }
  if (lower.includes("mime") || lower.includes("invalid_mime_type")) {
    return "Format non supporté (PDF uniquement).";
  }
  if (lower.includes("timed out")) {
    return "L'envoi du PDF a expiré. Réessayez.";
  }
  return "Impossible d'enregistrer le PDF pour le moment.";
}

/** Keep a readable, safe display filename ending in .pdf. */
function sanitizeFilename(name: string): string {
  const base = name.trim().replace(/\.pdf$/i, "");
  const safe = base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
  return `${safe || "document"}.pdf`;
}

async function ensureFormationPdfBucket(): Promise<void> {
  const client = getSupabaseServerClient();
  if (!client) {
    throw new Error("Configuration serveur incomplète.");
  }

  const { data: bucket, error: getError } =
    await client.storage.getBucket(FORMATION_PDF_BUCKET);
  if (bucket && !getError) return;

  const { error: createError } = await client.storage.createBucket(FORMATION_PDF_BUCKET, {
    public: true,
    fileSizeLimit: MAX_PDF_BYTES,
    allowedMimeTypes: [...ALLOWED_PDF_MIME_TYPES],
  });

  if (!createError) return;
  if (createError.message.toLowerCase().includes("already exists")) return;
  throw new Error(createError.message);
}

/**
 * Upload a PDF and return its public URL + a clean display filename.
 * Throws a user-facing message when storage is unavailable.
 */
export async function uploadFormationPdf(
  slug: string,
  bytes: Buffer,
  originalName: string,
): Promise<UploadedFormationPdf> {
  if (!isRealDataEnabled()) {
    throw new Error("Le stockage des PDF n'est pas disponible (Supabase requis).");
  }
  const client = getSupabaseServerClient();
  if (!client) {
    throw new Error("Configuration serveur incomplète.");
  }

  await withUploadTimeout(
    ensureFormationPdfBucket(),
    STORAGE_TIMEOUT_MS,
    "formation pdf bucket setup",
  );

  const safeName = sanitizeFilename(originalName);
  const storagePath = `formations/${slug}/${Date.now()}-${randomUUID().slice(0, 8)}-${safeName}`;

  const { error } = await withUploadTimeout(
    client.storage.from(FORMATION_PDF_BUCKET).upload(storagePath, bytes, {
      contentType: "application/pdf",
      upsert: false,
    }),
    STORAGE_TIMEOUT_MS,
    "formation pdf upload",
  );

  if (error) {
    throw new Error(mapStorageError(error.message));
  }

  const { data } = client.storage.from(FORMATION_PDF_BUCKET).getPublicUrl(storagePath);
  return { url: data.publicUrl, filename: safeName };
}

/** Best-effort deletion of a previously uploaded PDF by its public URL. */
export async function deleteFormationPdfByUrl(url: string | null | undefined): Promise<void> {
  if (!url || !isRealDataEnabled()) return;
  const client = getSupabaseServerClient();
  if (!client) return;

  const storagePath = extractStoragePath(url);
  if (!storagePath) return;

  await client.storage
    .from(FORMATION_PDF_BUCKET)
    .remove([storagePath])
    .catch(() => undefined);
}

function extractStoragePath(url: string): string | null {
  const marker = `/object/public/${FORMATION_PDF_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  const path = url.slice(index + marker.length).split("?")[0];
  return path || null;
}
