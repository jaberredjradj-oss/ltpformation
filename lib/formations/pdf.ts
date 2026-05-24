import type { Formation } from "@/lib/formations/types";

export const FORMATIONS_PDF_DIR = "/pdfs/formations";

export function getFormationPdfUrl(filename: string): string {
  return `${FORMATIONS_PDF_DIR}/${filename}`;
}

export function getFormationPdfPath(formation: Formation): string {
  return formation.pdfUrl;
}
