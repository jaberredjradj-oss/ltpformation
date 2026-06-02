"use client";

import { useRef, useState } from "react";
import { adminStyles } from "@/components/admin/admin-styles";
import {
  ALLOWED_COVER_MIME_TYPES,
  COVER_ACCEPT_ATTR,
  COVER_FORMATS_ERROR,
  MAX_COVER_IMAGE_BYTES,
  MAX_COVER_IMAGE_ERROR,
} from "@/lib/admin/formations/cover-constants";
import { getFormationCoverImage } from "@/lib/formation-cover-images";
import type { Formation } from "@/lib/formations/types";
import { cn } from "@/lib/utils";

interface FormationCoverFieldProps {
  mode: "create" | "edit";
  slug: string;
  imageKey: Formation["imageKey"];
  value: string | null | undefined;
  onChange: (url: string | null) => void;
}

interface CoverApiResult {
  ok: boolean;
  url?: string;
  error?: string;
}

function uploadWithProgress(
  slug: string,
  file: File,
  onProgress: (percent: number) => void,
): Promise<CoverApiResult> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("slug", slug);
    formData.append("file", file);

    xhr.open("POST", "/api/admin/formations/cover");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      try {
        resolve(JSON.parse(xhr.responseText) as CoverApiResult);
      } catch {
        resolve({ ok: false, error: "Réponse invalide du serveur." });
      }
    };
    xhr.onerror = () => resolve({ ok: false, error: "Erreur réseau pendant l'envoi." });
    xhr.send(formData);
  });
}

async function deleteRemoteCover(url: string): Promise<void> {
  try {
    await fetch("/api/admin/formations/cover", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch {
    // Best-effort: clearing the field is what matters for the editor.
  }
}

export function FormationCoverField({
  mode,
  slug,
  imageKey,
  value,
  onChange,
}: FormationCoverFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isCreate = mode === "create";
  const fallbackSrc = getFormationCoverImage({ slug, imageKey, coverImageUrl: null });
  const hasCustom = Boolean(value);
  const previewSrc = value || fallbackSrc;

  function openPicker() {
    setError(null);
    inputRef.current?.click();
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!(ALLOWED_COVER_MIME_TYPES as readonly string[]).includes(file.type)) {
      setError(COVER_FORMATS_ERROR);
      return;
    }
    if (file.size > MAX_COVER_IMAGE_BYTES) {
      setError(MAX_COVER_IMAGE_ERROR);
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    const previous = value ?? null;
    const result = await uploadWithProgress(slug, file, setProgress);

    setUploading(false);
    if (!result.ok || !result.url) {
      setError(result.error ?? "Envoi de l'image impossible.");
      return;
    }

    onChange(result.url);
    if (previous && previous !== result.url) {
      void deleteRemoteCover(previous);
    }
  }

  async function handleRemove() {
    const current = value;
    onChange(null);
    setError(null);
    if (current) {
      void deleteRemoteCover(current);
    }
  }

  return (
    <div className="block min-w-0 sm:col-span-2">
      <span className={`mb-1.5 block ${adminStyles.label}`}>
        Image de couverture
      </span>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100 sm:w-56">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewSrc}
            alt="Aperçu de la couverture"
            className="h-full w-full object-cover"
          />
          <span
            className={cn(
              "absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-medium",
              hasCustom
                ? "bg-blue-600/90 text-white"
                : "bg-white/85 text-slate-600",
            )}
          >
            {hasCustom ? "Personnalisée" : "Thème par défaut"}
          </span>
          {uploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-900/55 text-white">
              <span className="text-xs font-medium">Envoi… {progress}%</span>
              <div className="h-1.5 w-3/4 overflow-hidden rounded-full bg-white/30">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {isCreate ? (
            <p className="rounded-md border border-amber-100 bg-amber-50/70 px-3 py-2 text-xs text-amber-800">
              Enregistrez d&apos;abord la formation pour ajouter une image
              personnalisée. En attendant, le thème ci-dessus sert d&apos;image
              par défaut.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className={adminStyles.btnAccent}
                  onClick={openPicker}
                  disabled={uploading}
                >
                  {hasCustom ? "Remplacer l'image" : "Téléverser une image"}
                </button>
                {hasCustom && (
                  <button
                    type="button"
                    className={adminStyles.btnSecondary}
                    onClick={handleRemove}
                    disabled={uploading}
                  >
                    Retirer
                  </button>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-400">
                JPEG, PNG ou WebP — 3 Mo maximum.
              </p>
              {hasCustom ? (
                <p className="mt-1 text-xs font-medium text-blue-700">
                  Cette image personnalisée remplace le thème par défaut.
                </p>
              ) : (
                <p className="mt-1 text-xs text-slate-400">
                  Sans image personnalisée, le thème par défaut ci-dessus est utilisé.
                </p>
              )}
            </>
          )}

          {error && (
            <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={COVER_ACCEPT_ATTR}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
