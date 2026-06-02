export const FORMATION_PDF_BUCKET = "ltp-formation-pdfs";

export const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10 Mo

export const MAX_PDF_ERROR =
  "Le PDF dépasse la taille maximale autorisée (10 Mo).";

export const ALLOWED_PDF_MIME_TYPES = ["application/pdf"] as const;

export const ALLOWED_PDF_EXTENSIONS = [".pdf"] as const;

export const PDF_ACCEPT_ATTR = ".pdf,application/pdf";

export const PDF_FORMAT_ERROR = "Format non supporté (PDF uniquement).";
