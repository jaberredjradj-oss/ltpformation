import type { Formation } from "@/lib/formations/types";

export const formation: Formation = {
  slug: "ssiap-1-remise-a-niveau",
  title: "SSIAP 1 — Remise à niveau",
  shortTitle: "SSIAP 1 Remise à niveau",
  category: "securite-incendie",
  categoryLabel: "Sécurité incendie",
  type: "remise-a-niveau",
  typeLabel: "Remise à niveau",
  level: "1",
  durationHours: 21,
  durationLabel: "21 heures (3 jours)",
  price: {
    amount: 324,
    currency: "EUR",
    label: "324,00 € TTC par participant",
    shortLabel: "324,00 € TTC",
  },
  cpfEligible: true,
  certificationCode: "RS5641",
  certifications: ["Qualiopi"],
  summary: "La remise à niveau SSIAP 1 permet aux agents ayant dépassé leur date de recyclage de réactualiser leurs compétences et de retrouver leur qualification.",
  imageKey: "incendie",
  pdfFilename: "ssiap-1-remise-a-niveau.pdf",
  pdfUrl: "/pdfs/formations/ssiap-1-remise-a-niveau.pdf",
  pdfAvailable: true,
  contentStatus: "published",
  publicConcerned: [
    "Détenteur d'un SSIAP 1 ayant dépassé la date de recyclage triennal",
  ],
  prerequisites: [
    "Avoir le SSIAP 1 ou équivalent ayant dépassé sa date de validité",
    "PSC 1 de moins de 2 ans ou SST en cours de validité",
    "Certificat médical de moins de 3 mois (si pas d'activité)",
  ],
  presentation: "La remise à niveau SSIAP 1 permet aux agents ayant dépassé leur date de recyclage de réactualiser leurs compétences et de retrouver leur qualification.",
  objectives: [
    "Réactualiser ses connaissances en sécurité incendie",
    "Remettre à niveau ses compétences pratiques",
    "Retrouver sa qualification SSIAP 1",
  ],
  programme: {
    totalHours: 21,
    modules: [
    {
      title: "Fondamentaux et réglementation",
      hours: 7,
      content: [],
    },
    {
      title: "Installations techniques et moyens de secours",
      hours: 7,
      content: [],
    },
    {
      title: "Mises en situation et pratique",
      hours: 7,
      content: [],
    }
    ],
  },
  registration: [
    "De 4 à 12 participants. Formation en présentiel à Voisins-Le-Bretonneux au 26 Avenue René Duguay Trouin Bâtiment A 1ère étage.",
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
    "Attestation de remise à niveau SSIAP 1 valable 3 ans",
  ],
  careerOutcomes: [
    "Retrouver sa qualification pour exercer en tant qu'agent SSIAP 1.",
  ],
  accessibility: "Nos locaux sont accessibles aux personnes à mobilité réduite. Pour toute situation de handicap, merci de nous contacter afin d'étudier les adaptations possibles (aménagement du parcours, des supports pédagogiques, de la durée, etc.). Référent PSH M. BALLO : 06.40.41.62.10",
};
