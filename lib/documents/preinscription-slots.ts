import type { DocumentKind } from "@/lib/documents/types";

export type PreinscriptionDocumentSlot = {
  kind: DocumentKind;
  label: string;
  hint?: string;
  tier: "recommended" | "optional";
};

export const PREINSCRIPTION_DOCUMENT_SLOTS: PreinscriptionDocumentSlot[] = [
  {
    kind: "identity",
    label: "Pièce d'identité",
    hint: "Carte d'identité ou passeport en cours de validité.",
    tier: "recommended",
  },
  {
    kind: "medical_certificate",
    label: "Certificat médical d'aptitude",
    hint: "Attestation médicale requise pour les formations SSIAP.",
    tier: "recommended",
  },
  {
    kind: "first_aid",
    label: "Certificat SST / PSC1 / secourisme",
    hint: "Si vous en disposez déjà — facilite l'instruction du dossier.",
    tier: "recommended",
  },
  {
    kind: "cv",
    label: "CV",
    tier: "optional",
  },
  {
    kind: "cpf_proof",
    label: "Justificatif CPF",
    hint: "Attestation ou relevé Mon Compte Formation, si financement CPF.",
    tier: "optional",
  },
  {
    kind: "residence_permit",
    label: "Titre de séjour",
    hint: "Le cas échéant, pour les candidats non ressortissants UE.",
    tier: "optional",
  },
  {
    kind: "other",
    label: "Autre document",
    tier: "optional",
  },
];

const DOCUMENT_KIND_LABELS: Record<DocumentKind, string> = {
  identity: "Pièce d'identité",
  medical_certificate: "Certificat médical d'aptitude",
  first_aid: "Certificat SST / PSC1 / secourisme",
  cv: "CV",
  cpf_proof: "Justificatif CPF",
  residence_permit: "Titre de séjour",
  other: "Autre document",
  admin: "Document admin",
};

export function getDocumentKindLabel(kind: string | null | undefined): string {
  if (!kind) return "Document";
  return DOCUMENT_KIND_LABELS[kind as DocumentKind] ?? "Document";
}

export function createEmptyPreinscriptionDocuments(): Partial<Record<DocumentKind, File>> {
  return {};
}
