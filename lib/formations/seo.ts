/**
 * Surcouche SEO des pages formation (brief agence, référencement local IdF).
 *
 * Pourquoi une couche séparée plutôt que des champs dans `Formation` :
 * une ligne en base ÉCRASE intégralement la fiche statique
 * (lib/repositories/formations/index.ts). Un texte SEO stocké dans les données
 * disparaîtrait donc dès qu'une formation est modifiée depuis l'admin. Cette
 * table est appliquée par-dessus, quelle que soit la source de la fiche.
 *
 * Chaque champ est optionnel : sans entrée pour un slug, les pages conservent
 * exactement leur comportement actuel (titre = `title`, description = `summary`,
 * H1 = `shortTitle`).
 */

export interface FormationSeo {
  /** Balise <title> de la page (remplace le titre par défaut). */
  title?: string;
  /** Meta description (remplace le résumé). */
  description?: string;
  /** H1 affiché en tête de page (remplace le titre court). */
  h1?: string;
  /** Texte d'introduction localisé, affiché sous le résumé. */
  intro?: string;
  /** Texte alternatif de l'image de couverture. */
  imageAlt?: string;
}

const LOCALITE = "Voisins-le-Bretonneux";

export const FORMATION_SEO: Record<string, FormationSeo> = {
  "ssiap-1-initial": {
    title:
      "Formation SSIAP 1 à Saint-Quentin-en-Yvelines (78) | Agent de Sécurité Incendie | LT Protect Formation",
    description:
      "Obtenez votre certification SSIAP 1 à Voisins-le-Bretonneux, au cœur de l'Île-de-France. Formation agent de sécurité incendie certifiée Qualiopi, éligible CPF. Sessions régulières, formateurs terrain. Inscription rapide.",
    h1: "Formation SSIAP 1 : Agent de Sécurité Incendie à Saint-Quentin-en-Yvelines (78)",
    intro:
      "LT Protect Formation propose la certification SSIAP 1 à Voisins-le-Bretonneux, accessible depuis Paris, Versailles, Montigny-le-Bretonneux, Guyancourt et toute l'Île-de-France. La formation SSIAP 1 vous prépare aux fonctions d'agent de sécurité incendie dans les établissements recevant du public (ERP). Conforme à l'arrêté du 2 mai 2005. Financement CPF et France Travail disponible.",
    imageAlt: `Formation SSIAP 1 agent sécurité incendie LT Protect Formation ${LOCALITE} (78)`,
  },

  "ssiap-2-initial": {
    title:
      "Formation SSIAP 2 à Saint-Quentin-en-Yvelines (78) | Chef d'Équipe Sécurité Incendie | LT Protect Formation",
    description:
      "Passez chef d'équipe sécurité incendie avec la formation SSIAP 2 à Voisins-le-Bretonneux (78). Centre certifié Qualiopi, éligible CPF et France Travail. Formateurs issus du terrain. Sessions régulières en Île-de-France.",
    h1: "Formation SSIAP 2 : Chef d'Équipe Sécurité Incendie à Saint-Quentin-en-Yvelines (78)",
    intro:
      "LT Protect Formation vous accompagne vers la certification SSIAP 2 depuis Voisins-le-Bretonneux, accessible depuis Paris, Versailles, Montigny-le-Bretonneux, Guyancourt, Trappes et toute l'Île-de-France. La formation SSIAP 2 vous prépare aux fonctions de chef d'équipe du service de sécurité incendie. Prérequis : être titulaire du SSIAP 1. Conforme à l'arrêté du 2 mai 2005. Financement CPF disponible.",
    imageAlt:
      "Formation SSIAP 2 chef d'équipe sécurité incendie LT Protect Formation Saint-Quentin-en-Yvelines (78)",
  },

  "ssiap-3-initial": {
    title:
      "Formation SSIAP 3 à Saint-Quentin-en-Yvelines (78) | Chef de Service Sécurité Incendie | LT Protect Formation",
    description:
      "Devenez Chef de Service Sécurité Incendie avec la formation SSIAP 3 à Voisins-le-Bretonneux. Centre certifié Qualiopi, éligible CPF. Formateurs issus du terrain, sessions régulières accessibles depuis Paris et toute l'Île-de-France.",
    h1: "Formation SSIAP 3 : Chef de Service Sécurité Incendie à Saint-Quentin-en-Yvelines (78)",
    intro:
      "LT Protect Formation propose la certification SSIAP 3 à Voisins-le-Bretonneux, au cœur de Saint-Quentin-en-Yvelines, accessible depuis Paris, Versailles, Montigny-le-Bretonneux, Guyancourt et toute l'Île-de-France. La formation SSIAP 3 est la certification la plus élevée dans la filière sécurité incendie. Elle vous prépare aux fonctions de chef de service du système de sécurité incendie. Prérequis : être titulaire du SSIAP 2. Conforme à l'arrêté du 2 mai 2005. Financement CPF disponible.",
    imageAlt: `Formation SSIAP 3 chef de service sécurité incendie LT Protect Formation ${LOCALITE} Île-de-France`,
  },
};

export function getFormationSeo(slug: string): FormationSeo {
  return FORMATION_SEO[slug] ?? {};
}

/**
 * Texte alternatif d'image : valeur dédiée si définie, sinon un repli
 * enrichi de la localisation (règle générale du brief).
 */
export function buildFormationImageAlt(
  slug: string,
  fallbackLabel: string,
): string {
  const seo = getFormationSeo(slug);
  if (seo.imageAlt) return seo.imageAlt;
  return `${fallbackLabel} — LT Protect Formation ${LOCALITE} (78)`;
}
