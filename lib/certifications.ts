import { CERTIFICATIONS } from "@/lib/constants";

export type SiteCertification = (typeof CERTIFICATIONS)[number];

export function getCertificationPdf(cert: SiteCertification): string | undefined {
  return "certificatePdf" in cert ? cert.certificatePdf : undefined;
}
