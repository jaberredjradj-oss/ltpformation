import type { Formation } from "@/lib/formations/types";

export const formation: Formation = {
  slug: "ssiap-3-remise-a-niveau",
  title: "SSIAP 3 — Remise à niveau",
  shortTitle: "SSIAP 3 Remise à niveau",
  category: "securite-incendie",
  categoryLabel: "Sécurité incendie",
  type: "remise-a-niveau",
  typeLabel: "Remise à niveau",
  level: "3",
  durationHours: 35,
  durationLabel: "35 heures (5 jours)",
  price: {
    amount: 800,
    currency: "EUR",
    label: "800,00 € TTC par participant",
    shortLabel: "800,00 € TTC",
  },
  cpfEligible: true,
  certificationCode: "RS5643",
  certifications: ["Qualiopi"],
  summary: "La remise à niveau SSIAP 3 permet aux chefs de service sans activité suffisante de réactualiser leurs compétences.",
  imageKey: "incendie",
  pdfFilename: "ssiap-3-remise-a-niveau.pdf",
  pdfUrl: "/pdfs/formations/ssiap-3-remise-a-niveau.pdf",
  pdfAvailable: true,
  contentStatus: "published",
  publicConcerned: [
    "Chef de Service SSIAP 3 ne pouvant justifier du prérequis pour le recyclage",
  ],
  prerequisites: [
    "SSIAP 3 sans 1607 heures sur 36 mois ou ERP/IGH 3 non recyclé",
    "PSC 1 de moins de 2 ans ou SST/PSE en cours de validité",
  ],
  presentation: "La remise à niveau SSIAP 3 permet aux chefs de service sans activité suffisante de réactualiser leurs compétences.",
  objectives: [
    "Réactualiser ses connaissances de chef de service",
    "Remettre à niveau ses compétences managériales et techniques",
    "Retrouver sa qualification SSIAP 3",
  ],
  programme: {
    totalHours: 35,
    modules: [
    {
      title: "Réglementation et sécurité incendie",
      hours: 12,
      content: [],
    },
    {
      title: "Management et gestion",
      hours: 11,
      content: [],
    },
    {
      title: "Commission de sécurité et documents",
      hours: 12,
      content: [],
    }
    ],
  },
  registration: [
    "De 4 à 12 participants. Formation en présentiel à Voisins-Le-Bretonneux 26 Avenue René Duguay Trouin Bâtiment A 1ère étage.",
    "Contact initial : Prise de contact par téléphone, e-mail ou via notre site web",
    "Entretien et analyse : Évaluation des attentes et des besoins spécifiques du candidat",
    "Tests de positionnement : Vérification des prérequis",
    "Constitution du dossier : Validation des documents obligatoires",
    "Confirmation d'inscription : Envoi de la convention de formation et des modalités pratiques",
    "LT PROTECT FORMATION M. BALLO Téléphone : 06.40.41.62.10 Lieu de formation : Voisins-Le-Bretonneux (78)",
    "Lieu de formation : Voisins-Le-Bretonneux (78)",
    "Délai d'accès : Le délai d'accès à la formation dépend des dates de sessions programmées. Nous organisons régulièrement des sessions tout au long de l'année. Contactez-nous pour connaître les prochaines disponibilités.",
  ],
  evaluation: [
    "Évaluation continue des acquis.",
  ],
  pedagogicalTeam: [
    "Formateurs experts et qualifiés selon notre processus qualité (Qualiopi). Expérience significative dans le domaine enseigné. Pédagogie adaptée et interactive.",
  ],
  pedagogicalMeans: [
    "Salle de formation équipée (vidéoprojecteur, paperboard)",
    "Documents supports de formation",
    "Exposés théoriques et exercices pratiques",
    "Études de cas concrets",
    "Mise à disposition de documents en ligne",
    "Équipements techniques adaptés à la formation",
  ],
  followUp: [
    "Feuilles d'émargement signées par demi-journée",
    "Évaluations formatives continues",
    "Évaluation finale selon les modalités définies",
    "Questionnaire de satisfaction en fin de formation",
    "Attestation de fin de formation",
    "Attestation de remise à niveau SSIAP 3 valable 3 ans",
  ],
  careerOutcomes: [
    "Retrouver sa qualification de Chef de Service SSIAP 3.",
  ],
  accessibility: "Nos locaux sont accessibles aux personnes à mobilité réduite. Pour toute situation de handicap, merci de nous contacter afin d'étudier les adaptations possibles (aménagement du parcours, des supports pédagogiques, de la durée, etc.). Référent PSH M. BALLO : 06.40.41.62.10",
};
