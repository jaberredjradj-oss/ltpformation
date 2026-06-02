import { NextResponse } from "next/server";
import { assertAdminAccess } from "@/lib/admin/auth";
import {
  ALLOWED_PDF_MIME_TYPES,
  MAX_PDF_BYTES,
  MAX_PDF_ERROR,
  PDF_FORMAT_ERROR,
} from "@/lib/admin/formations/pdf-constants";
import {
  deleteFormationPdfByUrl,
  uploadFormationPdf,
} from "@/lib/admin/formations/pdf-storage";
import { SLUG_PATTERN } from "@/lib/admin/formations/validation";
import { ensureSupabaseEnvironmentValidated } from "@/lib/db/supabase-env";
import { withUploadTimeout } from "@/lib/documents/upload-timeout";
import { loadManagedFormationBySlug } from "@/lib/repositories/formations";

export const runtime = "nodejs";
export const maxDuration = 60;

const UPLOAD_REQUEST_TIMEOUT_MS = 45000;

interface PdfUploadResult {
  ok: boolean;
  url?: string;
  filename?: string;
  error?: string;
}

function isAccessDenied(error: unknown): boolean {
  return error instanceof Error && error.message.includes("Admin access denied");
}

async function handleUpload(request: Request): Promise<PdfUploadResult> {
  const formData = await request.formData();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const file = formData.get("file");

  if (!SLUG_PATTERN.test(slug)) {
    return { ok: false, error: "Slug invalide." };
  }

  const managed = await loadManagedFormationBySlug(slug);
  if (!managed) {
    return { ok: false, error: "Formation introuvable. Enregistrez-la avant d'ajouter un PDF." };
  }

  if (!(file instanceof File)) {
    return { ok: false, error: "Aucun fichier reçu." };
  }
  if (file.size === 0) {
    return { ok: false, error: "Fichier vide." };
  }
  if (file.size > MAX_PDF_BYTES) {
    return { ok: false, error: MAX_PDF_ERROR };
  }
  if (!(ALLOWED_PDF_MIME_TYPES as readonly string[]).includes(file.type)) {
    return { ok: false, error: PDF_FORMAT_ERROR };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const uploaded = await uploadFormationPdf(slug, bytes, file.name || "document.pdf");
  return { ok: true, url: uploaded.url, filename: uploaded.filename };
}

export async function POST(request: Request) {
  try {
    await assertAdminAccess();
    await ensureSupabaseEnvironmentValidated();

    const result = await withUploadTimeout(
      handleUpload(request),
      UPLOAD_REQUEST_TIMEOUT_MS,
      "formation pdf upload request",
    );

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (error) {
    if (isAccessDenied(error)) {
      return NextResponse.json({ ok: false, error: "Accès refusé." }, { status: 403 });
    }
    console.error("[formations:pdf-upload]", error);
    const message =
      error instanceof Error && error.message.includes("timed out")
        ? "L'envoi du PDF a expiré. Réessayez."
        : "Envoi du PDF impossible.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await assertAdminAccess();
    const body = (await request.json().catch(() => ({}))) as { url?: unknown };
    if (typeof body.url === "string" && body.url) {
      await deleteFormationPdfByUrl(body.url);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isAccessDenied(error)) {
      return NextResponse.json({ ok: false, error: "Accès refusé." }, { status: 403 });
    }
    console.error("[formations:pdf-delete]", error);
    return NextResponse.json(
      { ok: false, error: "Suppression du PDF impossible." },
      { status: 500 },
    );
  }
}
