export type EntityDocumentType = "preinscription" | "devis" | "message";

export type EntityDocumentUploader = "candidate" | "admin";

export type DocumentKind =
  | "identity"
  | "medical_certificate"
  | "first_aid"
  | "cv"
  | "cpf_proof"
  | "residence_permit"
  | "other"
  | "admin";

export interface EntityDocument {
  id: string;
  entityType: EntityDocumentType;
  entityId: string;
  documentKind: DocumentKind;
  fileName: string;
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
  uploadedBy: EntityDocumentUploader;
  uploadedAt: string;
}

export interface CreateEntityDocumentInput {
  entityType: EntityDocumentType;
  entityId: string;
  documentKind: DocumentKind;
  fileName: string;
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
  uploadedBy: EntityDocumentUploader;
}

export interface DocumentUploadEntry {
  file: File;
  documentKind: DocumentKind;
}
