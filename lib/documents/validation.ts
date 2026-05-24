import {
  ALLOWED_DOCUMENT_EXTENSIONS,
  ALLOWED_DOCUMENT_MIME_TYPES,
  MAX_DOCUMENT_SIZE_BYTES,
  MAX_DOCUMENT_SIZE_ERROR,
  MAX_DOCUMENTS_PER_UPLOAD,
} from "@/lib/documents/constants";

export interface ValidatedFileInput {
  name: string;
  type: string;
  size: number;
}

export function sanitizeFileName(name: string): string {
  const base = name.trim().replace(/[/\\?%*:|"<>]/g, "-");
  const parts = base.split(".");
  if (parts.length === 1) {
    return base.slice(0, 120) || "document";
  }
  const ext = parts.pop()?.slice(0, 10) ?? "bin";
  const stem = parts.join(".").slice(0, 100) || "document";
  return `${stem}.${ext}`;
}

function hasAllowedExtension(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return ALLOWED_DOCUMENT_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function hasAllowedMime(type: string, fileName: string): boolean {
  if (!type || type === "application/octet-stream") {
    return hasAllowedExtension(fileName);
  }

  return ALLOWED_DOCUMENT_MIME_TYPES.includes(
    type as (typeof ALLOWED_DOCUMENT_MIME_TYPES)[number],
  );
}

export function resolveDocumentMimeType(fileName: string, type: string): string {
  if (type && type !== "application/octet-stream") {
    return type;
  }

  const lower = fileName.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".png")) return "image/png";
  return type || "application/octet-stream";
}

export function validateDocumentFile(file: ValidatedFileInput): string | null {
  if (!file.name.trim()) {
    return "Nom de fichier invalide.";
  }

  if (file.size <= 0) {
    return "Fichier vide.";
  }

  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return MAX_DOCUMENT_SIZE_ERROR;
  }

  if (!hasAllowedExtension(file.name)) {
    return "Format non autorisé (PDF, JPG, JPEG, PNG uniquement).";
  }

  if (!hasAllowedMime(file.type, file.name)) {
    return "Format non autorisé (PDF, JPG, JPEG, PNG uniquement).";
  }

  return null;
}

export function validateDocumentBatch(files: ValidatedFileInput[]): string | null {
  if (files.length === 0) {
    return "Aucun fichier sélectionné.";
  }

  if (files.length > MAX_DOCUMENTS_PER_UPLOAD) {
    return `Maximum ${MAX_DOCUMENTS_PER_UPLOAD} fichiers par envoi.`;
  }

  for (const file of files) {
    const error = validateDocumentFile(file);
    if (error) return error;
  }

  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}
