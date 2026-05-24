import type { DocumentUploadResult } from "@/lib/documents/candidate-upload";

export async function uploadCandidateDocumentsRequest(
  formData: FormData,
): Promise<DocumentUploadResult> {
  const response = await fetch("/api/documents/upload", {
    method: "POST",
    body: formData,
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
}
