export const DOCUMENTS_BUCKET = "ltp-documents";

export const MAX_DOCUMENT_SIZE_BYTES = 2 * 1024 * 1024; // 2 Mo

export const MAX_DOCUMENT_SIZE_ERROR =
  "Le fichier dépasse la taille maximale autorisée (2 Mo).";

export const MAX_DOCUMENTS_PER_UPLOAD = 10;

export const ALLOWED_DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;

export const ALLOWED_DOCUMENT_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"] as const;

export const DOCUMENT_ACCEPT_ATTR = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";

export const ENTITY_DOCUMENT_FOLDERS: Record<
  import("@/lib/documents/types").EntityDocumentType,
  string
> = {
  preinscription: "preinscriptions",
  devis: "devis",
  message: "messages",
};
