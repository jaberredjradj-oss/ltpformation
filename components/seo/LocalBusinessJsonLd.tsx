import { SITE } from "@/lib/constants";

const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "EducationalOrganization"],
  name: SITE.name,
  description:
    "Centre de formation en sécurité incendie, sûreté, secourisme et habilitations électriques à Voisins-le-Bretonneux, Saint-Quentin-en-Yvelines (78).",
  url: "https://ltpformation.fr",
  telephone: "+33973880648",
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "26 Avenue René Duguay Trouin, Bâtiment A, 1er étage",
    addressLocality: "Voisins-le-Bretonneux",
    postalCode: "78960",
    addressRegion: "Yvelines",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 48.7557,
    longitude: 2.0567,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "18:00",
  },
  areaServed: [
    "Voisins-le-Bretonneux",
    "Saint-Quentin-en-Yvelines",
    "Montigny-le-Bretonneux",
    "Guyancourt",
    "Versailles",
    "Trappes",
    "Élancourt",
    "Yvelines",
    "Île-de-France",
  ],
  hasCredential: [
    { "@type": "EducationalOccupationalCredential", name: "Certification Qualiopi" },
    { "@type": "EducationalOccupationalCredential", name: "Certification Qualianor" },
  ],
} as const;

export function LocalBusinessJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
    />
  );
}
