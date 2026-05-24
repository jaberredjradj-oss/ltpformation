import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { DOCUMENTS_BUCKET } from "@/lib/documents/constants";
import { isRealDataEnabled } from "@/lib/db/env";
import { getSupabaseServerClient } from "@/lib/db/supabase-server";

const LOCAL_UPLOAD_ROOT = path.join(process.cwd(), ".data", "uploads");

async function ensureLocalDir(storagePath: string): Promise<string> {
  const fullPath = path.join(LOCAL_UPLOAD_ROOT, storagePath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  return fullPath;
}

export async function uploadDocumentBytes(
  storagePath: string,
  bytes: Buffer,
  mimeType: string,
): Promise<void> {
  if (isRealDataEnabled()) {
    const client = getSupabaseServerClient();
    if (!client) {
      throw new Error("Supabase non configuré.");
    }

    const { error } = await client.storage.from(DOCUMENTS_BUCKET).upload(storagePath, bytes, {
      contentType: mimeType,
      upsert: false,
    });

    if (error) {
      throw new Error(error.message);
    }

    return;
  }

  const fullPath = await ensureLocalDir(storagePath);
  await writeFile(fullPath, bytes);
}

export async function downloadDocumentBytes(storagePath: string): Promise<Buffer> {
  if (isRealDataEnabled()) {
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
