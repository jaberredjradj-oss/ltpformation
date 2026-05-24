export type LegalInline = {
  text: string;
  bold?: boolean;
  href?: string;
};

export type LegalBlock =
  | { type: "paragraph"; content: LegalInline[] }
  | { type: "list"; items: LegalInline[][] };

export type LegalSubsection = {
  title: string;
  blocks: LegalBlock[];
};

export type LegalSection = {
  title: string;
  blocks?: LegalBlock[];
  subsections?: LegalSubsection[];
  afterSubsections?: LegalBlock[];
};

export type LegalDocumentId = "mentions-legales" | "cgv";

export type LegalDocumentDefinition = {
  id: LegalDocumentId;
  title: string;
  pdfFilename: string;
  pdfDownloadLabel: string;
  seoTitle: string;
  seoDescription: string;
  path: `/${string}`;
  heroEyebrow: string;
  sections: LegalSection[];
};
