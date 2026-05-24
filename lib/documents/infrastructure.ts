import { DOCUMENTS_BUCKET, MAX_DOCUMENT_SIZE_BYTES } from "@/lib/documents/constants";
import { withUploadTimeout } from "@/lib/documents/upload-timeout";
import { isRealDataEnabled } from "@/lib/db/env";
import { getSupabaseServerClient } from "@/lib/db/supabase-server";

export type DocumentsStorageMode = "table" | "manifest";

const BOOTSTRAP_TIMEOUT_MS = 5000;

let bootstrapPromise: Promise<DocumentsStorageMode> | null = null;
let bootstrapDone = false;
let storageMode: DocumentsStorageMode = "table";

export function getDocumentsStorageMode(): DocumentsStorageMode {
  return storageMode;
}

function isMissingTableError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("entity_documents") &&
    (lower.includes("schema cache") ||
      lower.includes("does not exist") ||
      lower.includes("could not find the table"))
  );
}

async function ensureDocumentsBucket(): Promise<void> {
  const client = getSupabaseServerClient();
  if (!client) return;

  const { data: bucket, error: getError } = await client.storage.getBucket(DOCUMENTS_BUCKET);
  if (bucket && !getError) return;

  const { error: createError } = await client.storage.createBucket(DOCUMENTS_BUCKET, {
    public: false,
    fileSizeLimit: MAX_DOCUMENT_SIZE_BYTES,
  });

  if (!createError) return;

  const message = createError.message.toLowerCase();
  if (message.includes("already exists")) return;

  throw new Error(createError.message);
}

async function probeEntityDocumentsTable(): Promise<boolean> {
  const client = getSupabaseServerClient();
  if (!client) return false;

  const { error } = await client.from("entity_documents").select("id").limit(1);
  if (!error) return true;
  if (isMissingTableError(error.message)) return false;
  return false;
}

async function runBootstrap(): Promise<DocumentsStorageMode> {
  if (!isRealDataEnabled()) {
    storageMode = "table";
    bootstrapDone = true;
    return storageMode;
  }

  try {
    await withUploadTimeout(ensureDocumentsBucket(), BOOTSTRAP_TIMEOUT_MS, "documents bucket setup");

    const tableReady = await withUploadTimeout(
      probeEntityDocumentsTable(),
      BOOTSTRAP_TIMEOUT_MS,
      "entity_documents probe",
    );

    if (tableReady) {
      storageMode = "table";
      return storageMode;
    }

    storageMode = "manifest";
    console.warn(
      "[documents:infra] entity_documents unavailable — using storage manifest fallback.",
    );
    return storageMode;
  } catch (error) {
    storageMode = "manifest";
    console.error(
      "[documents:infra] bootstrap degraded to manifest fallback:",
      error instanceof Error ? error.message : error,
    );
    return storageMode;
  } finally {
    bootstrapDone = true;
  }
}

export async function ensureDocumentsInfrastructure(): Promise<DocumentsStorageMode> {
  if (!isRealDataEnabled()) {
    return "table";
  }

  if (bootstrapDone) {
    return storageMode;
  }

  if (!bootstrapPromise) {
    bootstrapPromise = runBootstrap().finally(() => {
      bootstrapPromise = null;
    });
  }

  return bootstrapPromise;
}
