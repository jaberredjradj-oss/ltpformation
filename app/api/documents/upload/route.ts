import { NextResponse } from "next/server";
import { processCandidateDocumentUpload } from "@/lib/documents/candidate-upload";
import { withUploadTimeout } from "@/lib/documents/upload-timeout";

export const runtime = "nodejs";
export const maxDuration = 30;

const UPLOAD_REQUEST_TIMEOUT_MS = 25000;

async function handleUpload(request: Request) {
  const formData = await request.formData();
  return processCandidateDocumentUpload(formData);
}

export async function POST(request: Request) {
  try {
    const result = await withUploadTimeout(
      handleUpload(request),
      UPLOAD_REQUEST_TIMEOUT_MS,
      "document upload request",
    );

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[documents:upload-api]", error);

    const message =
      error instanceof Error && error.message.includes("timed out")
        ? "L'envoi des documents a expiré. Réessayez."
        : "Envoi de fichiers impossible.";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
