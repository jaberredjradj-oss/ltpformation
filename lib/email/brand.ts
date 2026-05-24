import { SITE } from "@/lib/constants";
import { getSiteUrl } from "@/lib/site-url";

/** Official identifiers — aligned with approved legal content (CGV). */
export const EMAIL_BRAND = {
  name: "LT Protect Formation",
  addressLine1: "26 Avenue René Duguay-Trouin, Bâtiment A",
  addressLine2: "78960 Voisins-le-Bretonneux",
  siret: "87957170100025",
  activityDeclaration: "11788581978",
  email: "contact@ltpformation.fr",
  phone: SITE.phone,
  mobile: SITE.mobile,
  websiteUrl: getSiteUrl(),
  logoPath: "/logo.png",
  disclaimer:
    "Ce message est envoyé dans le cadre de votre demande auprès de LT Protect Formation.",
} as const;

export function getEmailLogoUrl(baseUrl?: string): string {
  const base = (baseUrl ?? EMAIL_BRAND.websiteUrl).replace(/\/$/, "");
  return `${base}${EMAIL_BRAND.logoPath}`;
}
