import type { GoogleReview, GoogleReviewsData } from "@/lib/reviews/types";

/**
 * Public Google Maps listing for LT Protect Formation (Voisins-le-Bretonneux).
 * Opens the business on Google Maps so visitors can read all reviews.
 */
/** Place ID for LT Protect Formation (26 Av. René Duguay Trouin, Voisins-le-Bretonneux). */
const GOOGLE_PLACE_ID = "ChIJY3Jix3OB5kcRii3cOcmTxws";

export const GOOGLE_REVIEWS_PROFILE_URL = `https://www.google.com/maps/place/?q=place_id:${GOOGLE_PLACE_ID}`;

/** Official Google review form (same Place ID as the Maps listing). */
export const GOOGLE_REVIEWS_WRITE_URL = `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`;

/**
 * Verified excerpts from the public Google Business profile (syndicated listings).
 * Do not alter meaning; only normalized line breaks for display.
 */
const GOOGLE_REVIEWS_STATIC: GoogleReview[] = [
  {
    id: "ouissalle-d",
    authorName: "Ouissalle D.",
    rating: 5,
    text: "Super centre de formation !!! Je recommande à 100% équipe professionnel super accueil du centre , les cours TOP! Foncez !",
  },
  {
    id: "glee-cqp",
    authorName: "ドールGlee",
    rating: 5,
    text: "J'ai effectué mon CQP avec LT Protect formateur au Top équipe géniale je recommande vivement aux personnes intéressés bientôt je vais revenir dans leurs locaux pour passe mon SSIAP .",
  },
  {
    id: "titi-g",
    authorName: "Titi G.",
    rating: 5,
    text: "Excellent centre ! Merci pour tout. Toute l'équipe pédagogique au top. Salles, équipements merci Abou",
  },
  {
    id: "wism",
    authorName: "Wism",
    rating: 5,
    text: "Formateurs pédagogues on apprend vite en peu de temps Bonne ambiance je recommande.",
  },
  {
    id: "korotoum-k",
    authorName: "Korotoum K.",
    rating: 5,
    text: "Parfait! , un excellent centre de formation très bien encadrée avec de très bons formateurs. L'endroit idéal pour se former dans les métiers de la sécurité et de la prévention des risques. Merci pour tout !",
  },
  {
    id: "moussa-k",
    authorName: "Moussa K.",
    rating: 5,
    text: "Excellent centre de formation. L'acceuil matinal est très chalereux, le rythme des cours est très bon; ni trop chargé, ni pas assez. Les formateurs sont très pédagogues et dotés d'une grande experience facilitant l'assimilation des cours.",
  },
  {
    id: "tembely-a",
    authorName: "Tembely A.",
    rating: 5,
    text: "Excellent centre formation et formateur de qualité ce qui explique que personne n'a était ajourné pour l'instant ! Je recommande très fortement",
  },
  {
    id: "sambali-t",
    authorName: "Sambali T.",
    rating: 5,
    text: "Excellent centre de formation avec de très bon formateur et un très bon encadrement et suivies merci à Lt Protect, je vous le recommande fortement",
  },
];

/** Aggregate rating published on the Google Maps listing (public directories). */
const GOOGLE_LISTING_AVERAGE = 5;
const GOOGLE_LISTING_TOTAL = 31;

function buildDataset(): GoogleReviewsData | null {
  if (GOOGLE_REVIEWS_STATIC.length === 0) return null;

  return {
    averageRating: GOOGLE_LISTING_AVERAGE,
    totalCount: GOOGLE_LISTING_TOTAL,
    profileUrl: GOOGLE_REVIEWS_PROFILE_URL,
    writeReviewUrl: GOOGLE_REVIEWS_WRITE_URL,
    reviews: GOOGLE_REVIEWS_STATIC,
  };
}

/** Returns review data or null — callers must hide the section when null. */
export function getGoogleReviews(): GoogleReviewsData | null {
  return buildDataset();
}
