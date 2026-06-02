"use client";

import { useRef, useState } from "react";
import { adminStyles } from "@/components/admin/admin-styles";
import {
  ALLOWED_PDF_MIME_TYPES,
  MAX_PDF_BYTES,
  MAX_PDF_ERROR,
  PDF_ACCEPT_ATTR,
  PDF_FORMAT_ERROR,
} from "@/lib/admin/formations/pdf-constants";

export interface FormationPdfValue {
  pdfUrl: string;
  pdfFilename: string;
  pdfAvailable: boolean;
}

interface FormationPdfFieldProps {
  mode: "create" | "edit";
  slug: string;
  pdfUrl: string;
  pdfFilename: string;
  pdfAvailable: boolean;
  onChange: (value: FormationPdfValue) => void;
}

interface PdfApiResult {
  ok: boolean;
  url?: string;
  filename?: string;
  error?: string;
}

function uploadWithProgress(
  slug: string,
  file: File,
  onProgress: (percent: number) => void,
): Promise<PdfApiResult> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("slug", slug);
    formData.append("file", file);

    xhr.open("POST", "/api/admin/formations/pdf");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      try {
        resolve(JSON.parse(xhr.responseText) as PdfApiResult);
      } catch {
        resolve({ ok: false, error: "Réponse invalide du serveur." });
      }
    };
    xhr.onerror = () => resolve({ ok: false, error: "Erreur réseau pendant l'envoi." });
    xhr.send(formData);
  });
}

async function deleteRemotePdf(url: string): Promise<void> {
  try {
    await fetch("/api/admin/formations/pdf", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch {
    // Best-effort: clearing the field is what matters for the editor.
  }
}

export function FormationPdfField({
  mode,
  slug,
  pdfUrl,
  pdfFilename,
  pdfAvailable,
  onChange,
}: FormationPdfFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isCreate = mode === "create";
  const hasPdf = pdfAvailable && Boolean(pdfUrl);
  const isUploaded = /^https?:\/\//.test(pdfUrl);

  function openPicker() {
    setError(null);
    inputRef.current?.click();
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!(ALLOWED_PDF_MIME_TYPES as readonly string[]).includes(file.type)) {
      setError(PDF_FORMAT_ERROR);
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      setError(MAX_PDF_ERROR);
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    const previous = isUploaded ? pdfUrl : null;
    const result = await uploadWithProgress(slug, file, setProgress);

    setUploading(false);
    if (!result.ok || !result.url) {
      setError(result.error ?? "Envoi du PDF impossible.");
      return;
    }

    onChange({
      pdfUrl: result.url,
      pdfFilename: result.filename ?? file.name,
      pdfAvailable: true,
    });
    if (previous && previous !== result.url) {
      void deleteRemotePdf(previous);
    }
  }

  function handleRemove() {
    const current = isUploaded ? pdfUrl : null;
    onChange({ pdfUrl: "", pdfFilename: "", pdfAvailable: false });
    setError(null);
    if (current) {
      void deleteRemotePdf(current);
    }
  }

  return (
    <div className="block min-w-0 sm:col-span-2">
      <span className={`mb-1.5 block ${adminStyles.label}`}>Programme PDF</span>

      <div className={`${adminStyles.surfaceMuted} p-4`}>
        {hasPdf ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-50 text-xs font-bold text-red-600">
                PDF
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">
                  {pdfFilename || "Document.pdf"}
                </p>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Voir le PDF
                </a>
              </div>
            </div>
            {!isCreate && (
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <button
                  type="button"
                  className={adminStyles.btnAccent}
                  onClick={openPicker}
                  disabled={uploading}
                >
                  Remplacer
                </button>
                <button
                  type="button"
                  className={adminStyles.btnSecondary}
                  onClick={handleRemove}
                  disabled={uploading}
                >
                  Retirer
                </button>
              </div>
            )}
          </div>
        ) : isCreate ? (
          <p className="rounded-md border border-amber-100 bg-amber-50/70 px-3 py-2 text-xs text-amber-800">
            Enregistrez d&apos;abord la formation pour téléverser son programme PDF.
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className={adminStyles.btnAccent}
              onClick={openPicker}
              disabled={uploading}
            >
              Téléverser un PDF
            </button>
            <span className="text-xs text-slate-400">PDF uniquement — 10 Mo maximum.</span>
          </div>
        )}

        {uploading && (
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
              <span>Envoi en cours…</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={PDF_ACCEPT_ATTR}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
