"use client";

import { useEffect, useRef, useState } from "react";
import {
  listEntityDocuments,
  uploadAdminDocuments,
} from "@/lib/documents/actions";
import {
  DOCUMENT_ACCEPT_ATTR,
} from "@/lib/documents/constants";
import { getDocumentKindLabel } from "@/lib/documents/preinscription-slots";
import type { EntityDocument, EntityDocumentType } from "@/lib/documents/types";
import { formatFileSize } from "@/lib/documents/validation";
import { adminStyles } from "@/components/admin/admin-styles";
import { useAdminToast } from "@/components/admin/AdminToast";
import { cn } from "@/lib/utils";

interface AdminEntityDocumentsDialogProps {
  open: boolean;
  entityType: EntityDocumentType;
  entityId: string;
  entityLabel: string;
  onClose: () => void;
}

function formatUploadDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function AdminEntityDocumentsDialog({
  open,
  entityType,
  entityId,
  entityLabel,
  onClose,
}: AdminEntityDocumentsDialogProps) {
  const { showToast } = useAdminToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<EntityDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);

    listEntityDocuments(entityType, entityId)
      .then((items) => {
        if (!cancelled) setDocuments(items);
      })
      .catch(() => {
        if (!cancelled) showToast("Impossible de charger les documents.", "error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, entityType, entityId, showToast]);

  async function handleUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("entityType", entityType);
    formData.append("entityId", entityId);
    Array.from(fileList).forEach((file) => formData.append("files", file));

    const result = await uploadAdminDocuments(formData);
    setUploading(false);

    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }

    showToast(
      result.uploadedCount > 1
        ? `${result.uploadedCount} fichiers ajoutés.`
        : "Fichier ajouté.",
    );

    const refreshed = await listEntityDocuments(entityType, entityId);
    setDocuments(refreshed);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-900/40 px-4 py-6">
      <div
        className={cn(
          adminStyles.surface,
          "flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden",
        )}
      >
        <div className={cn(adminStyles.sectionHeader, "border-b")}>
          <h2 className="text-lg font-semibold text-slate-900">Documents</h2>
          <p className="mt-1 text-sm text-slate-600">{entityLabel}</p>
        </div>

        <div className="space-y-4 overflow-y-auto px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className={adminStyles.label}>
              {documents.length} fichier{documents.length > 1 ? "s" : ""}
            </p>
            <div className="text-right">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className={adminStyles.btnAccent}
              >
                {uploading ? "Envoi…" : "Ajouter un fichier"}
              </button>
              <p className="mt-1 text-[11px] text-slate-500">PDF, JPG, JPEG, PNG — 2 Mo max.</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={DOCUMENT_ACCEPT_ATTR}
                className="hidden"
                onChange={(event) => handleUpload(event.target.files)}
              />
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">Chargement…</p>
          ) : documents.length === 0 ? (
            <div className={cn(adminStyles.surfaceMuted, "px-4 py-8 text-center")}>
              <p className="text-sm font-medium text-slate-700">Aucun document</p>
              <p className="mt-1 text-xs text-slate-500">
                Les fichiers envoyés par le candidat ou ajoutés manuellement apparaîtront ici.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      {getDocumentKindLabel(doc.documentKind)}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-600">{doc.fileName}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatFileSize(doc.sizeBytes)} · {formatUploadDate(doc.uploadedAt)} ·{" "}
                      {doc.uploadedBy === "admin" ? "Admin" : "Candidat"}
                    </p>
                  </div>
                  <a
                    href={`/admin/documents/${doc.id}/download`}
                    className={adminStyles.btnSecondary}
                  >
                    Télécharger
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <button type="button" onClick={onClose} className={adminStyles.btnSecondary}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
