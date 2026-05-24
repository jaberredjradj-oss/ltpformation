import type { DocumentUploadResult } from "@/lib/documents/candidate-upload";

const UPLOAD_FETCH_TIMEOUT_MS = 30000;

export async function uploadCandidateDocumentsRequest(
  formData: FormData,
): Promise<DocumentUploadResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPLOAD_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch("/api/documents/upload", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    let payload: DocumentUploadResult;

    try {
      payload = (await response.json()) as DocumentUploadResult;
    } catch {
      return { ok: false, error: "Réponse serveur invalide lors de l'envoi des documents." };
    }

    if (!response.ok && payload.ok !== false) {
      return { ok: false, error: "Envoi de fichiers impossible." };
    }

    return payload;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { ok: false, error: "L'envoi des documents a expiré. Réessayez." };
    }
    return { ok: false, error: "Envoi de fichiers impossible." };
  } finally {
    clearTimeout(timeout);
  }
}
