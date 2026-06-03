import type { Formation } from "@/lib/formations/types";

export const formation: Formation = {
  slug: "ssiap-2-remise-a-niveau",
  title: "SSIAP 2 — Remise à niveau",
  shortTitle: "SSIAP 2 Remise à niveau",
  category: "securite-incendie",
  categoryLabel: "Sécurité incendie",
  type: "remise-a-niveau",
  typeLabel: "Remise à niveau",
  level: "2",
  durationHours: 21,
  durationLabel: "21 heures (3 jours)",
  price: {
    amount: 335,
    currency: "EUR",
    label: "335,00 € TTC par participant",
    shortLabel: "335,00 € TTC",
  },
  cpfEligible: true,
  certificationCode: "RS5642",
  certifications: ["Qualiopi"],
  summary: "La remise à niveau SSIAP 2 permet aux chefs d'équipe n'ayant pas d'activité suffisante de réactualiser leurs compétences.",
  imageKey: "incendie",
  pdfFilename: "ssiap-2-remise-a-niveau.pdf",
  pdfUrl: "/pdfs/formations/ssiap-2-remise-a-niveau.pdf",
  pdfAvailable: true,
  contentStatus: "published",
  publicConcerned: [
    "Chefs d'équipe SSIAP 2 n'ayant pas travaillé 1607 heures sur 36 mois",
  ],
  prerequisites: [
    "Qualification SSIAP 2 sans justifier de 1607h sur 36 mois",
    "PSC 1 de moins de 2 ans ou SST/PSE en cours de validité",
    "Certificat médical de moins de 3 mois",
  ],
  presentation: "La remise à niveau SSIAP 2 permet aux chefs d'équipe n'ayant pas d'activité suffisante de réactualiser leurs compétences.",
  objectives: [
    "Réactualiser ses connaissances de chef d'équipe",
    "Remettre à niveau ses compétences opérationnelles et managériales",
    "Retrouver sa qualification SSIAP 2",
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
      title: "Gestion du PC et de l'équipe",
      hours: 7,
      content: [],
    },
    {
      title: "Mises en situation pratiques",
      hours: 7,
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
    "Formateurs experts et qualifiés selon notre processus qualité interne. Expérience significative dans le domaine enseigné. Pédagogie adaptée et interactive.",
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
    "Attestation de remise à niveau SSIAP 2 valable 3 ans",
  ],
  careerOutcomes: [
    "Retrouver sa qualification de Chef d'Équipe SSIAP 2.",
  ],
  accessibility: "Nos locaux sont accessibles aux personnes à mobilité réduite. Pour toute situation de handicap, merci de nous contacter afin d'étudier les adaptations possibles (aménagement du parcours, des supports pédagogiques, de la durée, etc.). Référent PSH M. BALLO : 06.40.41.62.10",
};
