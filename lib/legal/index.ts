import { cgvDocument } from "@/lib/legal/content/cgv";
import { mentionsLegalesDocument } from "@/lib/legal/content/mentions-legales";
import type { LegalDocumentDefinition, LegalDocumentId } from "@/lib/legal/types";

const LEGAL_DOCUMENTS: Record<LegalDocumentId, LegalDocumentDefinition> = {
  "mentions-legales": mentionsLegalesDocument,
  cgv: cgvDocument,
};

export function getLegalDocument(id: LegalDocumentId): LegalDocumentDefinition {
  return LEGAL_DOCUMENTS[id];
}

export function getLegalDocumentByPdfFilename(
  filename: string,
): LegalDocumentDefinition | null {
  return Object.values(LEGAL_DOCUMENTS).find((doc) => doc.pdfFilename === filename) ?? null;
}

export const LEGAL_DOCUMENT_LIST = Object.values(LEGAL_DOCUMENTS);
