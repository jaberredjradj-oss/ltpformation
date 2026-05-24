"use client";

import { useRef, useState } from "react";
import {
  DOCUMENT_ACCEPT_ATTR,
  MAX_DOCUMENT_SIZE_BYTES,
} from "@/lib/documents/constants";
import { formatFileSize, validateDocumentFile } from "@/lib/documents/validation";
import { cn } from "@/lib/utils";

interface DocumentUploadFieldProps {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
  error?: string | null;
}

export function DocumentUploadField({
  files,
  onChange,
  disabled = false,
  error,
}: DocumentUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  function addFiles(incoming: FileList | File[]) {
    const next = [...files];
    const list = Array.from(incoming);

    for (const file of list) {
      const validationError = validateDocumentFile({
        name: file.name,
        type: file.type,
        size: file.size,
      });

      if (validationError) {
        setLocalError(validationError);
        continue;
      }

      next.push(file);
    }

    setLocalError(null);
    onChange(next);
  }

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index));
    setLocalError(null);
  }

  const displayError = error ?? localError;

  return (
    <div className="space-y-3">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          if (disabled) return;
          if (event.dataTransfer.files.length > 0) {
            addFiles(event.dataTransfer.files);
          }
        }}
        className={cn(
          "rounded-xl border border-dashed px-4 py-5 text-center transition-colors",
          dragOver ? "border-blue-400 bg-blue-50/40" : "border-slate-200 bg-slate-50/50",
          disabled && "opacity-60",
        )}
      >
        <p className="text-sm font-medium text-navy-950">Documents joints (optionnel)</p>
        <p className="mt-1 text-xs text-body-strong">
          PDF, JPG, JPEG ou PNG — max. {formatFileSize(MAX_DOCUMENT_SIZE_BYTES)} par fichier
        </p>
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="mt-3 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-950 transition-colors hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed"
        >
          Choisir des fichiers
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={DOCUMENT_ACCEPT_ATTR}
          className="hidden"
          disabled={disabled}
          onChange={(event) => {
            if (event.target.files) {
              addFiles(event.target.files);
              event.target.value = "";
            }
          }}
        />
      </div>

      {files.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-navy-900"
            >
              <span className="truncate">{file.name}</span>
              <span className="shrink-0 text-lead-strong">{formatFileSize(file.size)}</span>
              <button
                type="button"
                disabled={disabled}
                onClick={() => removeFile(index)}
                className="shrink-0 font-semibold text-slate-500 hover:text-red-600"
                aria-label={`Retirer ${file.name}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {displayError && <p className="text-xs font-medium text-red-700">{displayError}</p>}
    </div>
  );
}
