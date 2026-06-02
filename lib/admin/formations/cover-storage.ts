import { randomUUID } from "node:crypto";
import { isRealDataEnabled } from "@/lib/db/env";
import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import { withUploadTimeout } from "@/lib/documents/upload-timeout";
import {
  ALLOWED_COVER_MIME_TYPES,
  FORMATION_IMAGES_BUCKET,
  MAX_COVER_IMAGE_BYTES,
  MAX_COVER_IMAGE_ERROR,
} from "@/lib/admin/formations/cover-constants";

const STORAGE_TIMEOUT_MS = 15000;

function mapStorageError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("bucket not found")) {
    return "Le stockage des images n'est pas configuré.";
  }
  if (lower.includes("payload too large") || lower.includes("entity too large")) {
    return MAX_COVER_IMAGE_ERROR;
  }
  if (lower.includes("mime") || lower.includes("invalid_mime_type")) {
    return "Format non supporté (JPEG, PNG ou WebP uniquement).";
  }
  if (lower.includes("timed out")) {
    return "L'envoi de l'image a expiré. Réessayez.";
  }
  return "Impossible d'enregistrer l'image pour le moment.";
}

/** Create the public cover-image bucket if it does not already exist. */
async function ensureFormationImagesBucket(): Promise<void> {
  const client = getSupabaseServerClient();
  if (!client) {
    throw new Error("Configuration serveur incomplète.");
  }

  const { data: bucket, error: getError } =
    await client.storage.getBucket(FORMATION_IMAGES_BUCKET);
  if (bucket && !getError) return;

  const { error: createError } = await client.storage.createBucket(FORMATION_IMAGES_BUCKET, {
    public: true,
    fileSizeLimit: MAX_COVER_IMAGE_BYTES,
    allowedMimeTypes: [...ALLOWED_COVER_MIME_TYPES],
  });

  if (!createError) return;
  if (createError.message.toLowerCase().includes("already exists")) return;
  throw new Error(createError.message);
}

/**
 * Upload a cover image and return its public URL.
 * Throws a user-facing message when storage is unavailable.
 */
export async function uploadFormationCover(
  slug: string,
  bytes: Buffer,
  mimeType: string,
  extension: string,
): Promise<string> {
  if (!isRealDataEnabled()) {
    throw new Error("Le stockage des images n'est pas disponible (Supabase requis).");
  }
  const client = getSupabaseServerClient();
  if (!client) {
    throw new Error("Configuration serveur incomplète.");
  }

  await withUploadTimeout(
    ensureFormationImagesBucket(),
    STORAGE_TIMEOUT_MS,
    "formation images bucket setup",
  );

  const storagePath = `covers/${slug}/${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;

  const { error } = await withUploadTimeout(
    client.storage.from(FORMATION_IMAGES_BUCKET).upload(storagePath, bytes, {
      contentType: mimeType,
      upsert: false,
    }),
    STORAGE_TIMEOUT_MS,
    "formation cover upload",
  );

  if (error) {
    throw new Error(mapStorageError(error.message));
  }

  const { data } = client.storage.from(FORMATION_IMAGES_BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

/** Best-effort deletion of a previously uploaded cover image by its public URL. */
export async function deleteFormationCoverByUrl(url: string | null | undefined): Promise<void> {
  if (!url || !isRealDataEnabled()) return;
  const client = getSupabaseServerClient();
  if (!client) return;

  const storagePath = extractStoragePath(url);
  if (!storagePath) return;

  await client.storage
    .from(FORMATION_IMAGES_BUCKET)
    .remove([storagePath])
    .catch(() => undefined);
}

/**
 * Extract the in-bucket storage path from a Supabase public URL, e.g.
 * https://<proj>.supabase.co/storage/v1/object/public/ltp-formation-images/covers/x/y.jpg
 * → covers/x/y.jpg. Returns null for URLs outside our bucket.
 */
function extractStoragePath(url: string): string | null {
  const marker = `/object/public/${FORMATION_IMAGES_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  const path = url.slice(index + marker.length).split("?")[0];
  return path || null;
}
