"use client";

import { useRef, useState } from "react";
import { DOCUMENT_ACCEPT_ATTR } from "@/lib/documents/constants";
import {
  PREINSCRIPTION_DOCUMENT_SLOTS,
  type PreinscriptionDocumentSlot,
} from "@/lib/documents/preinscription-slots";
import type { DocumentKind } from "@/lib/documents/types";
import { formatFileSize, validateDocumentFile } from "@/lib/documents/validation";
import { cn } from "@/lib/utils";

interface PreinscriptionDocumentsUploadProps {
  documents: Partial<Record<DocumentKind, File>>;
  onChange: (documents: Partial<Record<DocumentKind, File>>) => void;
  disabled?: boolean;
  error?: string | null;
}

function DocumentSlot({
  slot,
  file,
  disabled,
  onSelect,
  onRemove,
}: {
  slot: PreinscriptionDocumentSlot;
  file: File | null;
  disabled?: boolean;
  onSelect: (file: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  function handleFile(incoming: File | null) {
    if (!incoming) return;

    const validationError = validateDocumentFile({
      name: incoming.name,
      type: incoming.type,
      size: incoming.size,
    });

    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setLocalError(null);
    onSelect(incoming);
  }

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white px-4 py-3.5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-navy-950">{slot.label}</p>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                slot.tier === "recommended"
                  ? "bg-blue-50 text-blue-700"
                  : "bg-slate-100 text-slate-600",
              )}
            >
              {slot.tier === "recommended" ? "Recommandé" : "Facultatif"}
            </span>
          </div>
          {slot.hint && (
            <p className="mt-1 text-xs leading-relaxed text-body-strong">{slot.hint}</p>
          )}
        </div>
        {!file && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-navy-950 transition-colors hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Ajouter
          </button>
        )}
      </div>

      {file && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2">
          <span className="min-w-0 truncate text-xs font-medium text-navy-900">{file.name}</span>
          <span className="text-xs text-lead-strong">{formatFileSize(file.size)}</span>
          <button
            type="button"
            disabled={disabled}
            onClick={onRemove}
            className="ml-auto text-xs font-semibold text-slate-500 hover:text-red-600"
          >
            Retirer
          </button>
        </div>
      )}

      {localError && <p className="mt-2 text-xs font-medium text-red-700">{localError}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={DOCUMENT_ACCEPT_ATTR}
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          const selected = event.target.files?.[0] ?? null;
          handleFile(selected);
          event.target.value = "";
        }}
      />
    </div>
  );
}

function renderSlotGroup(
  tier: PreinscriptionDocumentSlot["tier"],
  props: PreinscriptionDocumentsUploadProps,
) {
  const slots = PREINSCRIPTION_DOCUMENT_SLOTS.filter((slot) => slot.tier === tier);

  return (
    <div className="space-y-3">
      {slots.map((slot) => (
        <DocumentSlot
          key={slot.kind}
          slot={slot}
          file={props.documents[slot.kind] ?? null}
          disabled={props.disabled}
          onSelect={(file) =>
            props.onChange({
              ...props.documents,
              [slot.kind]: file,
            })
          }
          onRemove={() => {
            const next = { ...props.documents };
            delete next[slot.kind];
            props.onChange(next);
          }}
        />
      ))}
    </div>
  );
}

export function PreinscriptionDocumentsUpload({
  documents,
  onChange,
  disabled = false,
  error,
}: PreinscriptionDocumentsUploadProps) {
  return (
    <div className="space-y-4 rounded-xl border border-slate-200/90 bg-slate-50/40 p-4 md:p-5">
      <div>
        <p className="text-sm font-semibold text-navy-950">Documents recommandés</p>
        <p className="mt-1 text-xs leading-relaxed text-body-strong">
          Ajoutez vos documents pour accélérer le traitement de votre dossier. Aucun document
          n&apos;est obligatoire à ce stade — PDF, JPG, JPEG ou PNG, 2 Mo maximum par fichier.
        </p>
      </div>

      {renderSlotGroup("recommended", { documents, onChange, disabled, error })}

      <div className="border-t border-slate-200/80 pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Documents facultatifs
        </p>
        {renderSlotGroup("optional", { documents, onChange, disabled, error })}
      </div>

      {error && <p className="text-xs font-medium text-red-700">{error}</p>}
    </div>
  );
}

export function countPreinscriptionDocuments(documents: Partial<Record<DocumentKind, File>>): number {
  return Object.values(documents).filter(Boolean).length;
}
