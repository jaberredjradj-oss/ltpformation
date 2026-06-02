import { NextResponse } from "next/server";
import { assertAdminAccess } from "@/lib/admin/auth";
import {
  ALLOWED_COVER_MIME_TYPES,
  COVER_FORMATS_ERROR,
  COVER_MIME_EXTENSION,
  MAX_COVER_IMAGE_BYTES,
  MAX_COVER_IMAGE_ERROR,
} from "@/lib/admin/formations/cover-constants";
import {
  deleteFormationCoverByUrl,
  uploadFormationCover,
} from "@/lib/admin/formations/cover-storage";
import { SLUG_PATTERN } from "@/lib/admin/formations/validation";
import { ensureSupabaseEnvironmentValidated } from "@/lib/db/supabase-env";
import { withUploadTimeout } from "@/lib/documents/upload-timeout";
import { loadManagedFormationBySlug } from "@/lib/repositories/formations";

export const runtime = "nodejs";
export const maxDuration = 30;

const UPLOAD_REQUEST_TIMEOUT_MS = 25000;

interface CoverUploadResult {
  ok: boolean;
  url?: string;
  error?: string;
}

function isAccessDenied(error: unknown): boolean {
  return error instanceof Error && error.message.includes("Admin access denied");
}

async function handleUpload(request: Request): Promise<CoverUploadResult> {
  const formData = await request.formData();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const file = formData.get("file");

  if (!SLUG_PATTERN.test(slug)) {
    return { ok: false, error: "Slug invalide." };
  }

  const managed = await loadManagedFormationBySlug(slug);
  if (!managed) {
    return { ok: false, error: "Formation introuvable. Enregistrez-la avant d'ajouter une image." };
  }

  if (!(file instanceof File)) {
    return { ok: false, error: "Aucun fichier reçu." };
  }
  if (file.size === 0) {
    return { ok: false, error: "Fichier vide." };
  }
  if (file.size > MAX_COVER_IMAGE_BYTES) {
    return { ok: false, error: MAX_COVER_IMAGE_ERROR };
  }

  const mimeType = file.type;
  if (!(ALLOWED_COVER_MIME_TYPES as readonly string[]).includes(mimeType)) {
    return { ok: false, error: COVER_FORMATS_ERROR };
  }

  const extension = COVER_MIME_EXTENSION[mimeType];
  const bytes = Buffer.from(await file.arrayBuffer());
  const url = await uploadFormationCover(slug, bytes, mimeType, extension);
  return { ok: true, url };
}

export async function POST(request: Request) {
  try {
    await assertAdminAccess();
    await ensureSupabaseEnvironmentValidated();

    const result = await withUploadTimeout(
      handleUpload(request),
      UPLOAD_REQUEST_TIMEOUT_MS,
      "formation cover upload request",
    );

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (error) {
    if (isAccessDenied(error)) {
      return NextResponse.json({ ok: false, error: "Accès refusé." }, { status: 403 });
    }
    console.error("[formations:cover-upload]", error);
    const message =
      error instanceof Error && error.message.includes("timed out")
        ? "L'envoi de l'image a expiré. Réessayez."
        : "Envoi de l'image impossible.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await assertAdminAccess();
    const body = (await request.json().catch(() => ({}))) as { url?: unknown };
    if (typeof body.url === "string" && body.url) {
      await deleteFormationCoverByUrl(body.url);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isAccessDenied(error)) {
      return NextResponse.json({ ok: false, error: "Accès refusé." }, { status: 403 });
    }
    console.error("[formations:cover-delete]", error);
    return NextResponse.json(
      { ok: false, error: "Suppression de l'image impossible." },
      { status: 500 },
    );
  }
}
