import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { getLegalDocument } from "@/lib/legal";
import { getSiteUrl } from "@/lib/site-url";

const document = getLegalDocument("mentions-legales");

export const metadata: Metadata = {
  title: document.seoTitle,
  description: document.seoDescription,
  alternates: {
    canonical: `${getSiteUrl()}${document.path}`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MentionsLegalesPage() {
  return <LegalDocumentPage document={document} />;
}
