import type { Formation } from "@/lib/formations/types";

export const formation: Formation = {
  slug: "ssiap-3-recyclage",
  title: "SSIAP 3 — Recyclage",
  shortTitle: "SSIAP 3 Recyclage",
  category: "securite-incendie",
  categoryLabel: "Sécurité incendie",
  type: "recyclage",
  typeLabel: "Recyclage",
  level: "3",
  durationHours: 21,
  durationLabel: "21 heures (3 jours)",
  price: {
    amount: 600,
    currency: "EUR",
    label: "600,00 € TTC par participant",
    shortLabel: "600,00 € TTC",
  },
  cpfEligible: true,
  certificationCode: "RS5643",
  certifications: ["Qualiopi"],
  summary: "Le recyclage SSIAP 3 permet de maintenir et actualiser les compétences des chefs de service tous les 3 ans.",
  imageKey: "incendie",
  pdfFilename: "ssiap-3-recyclage.pdf",
  pdfUrl: "/pdfs/formations/ssiap-3-recyclage.pdf",
  pdfAvailable: true,
  contentStatus: "published",
  publicConcerned: [
    "Chef de Service de Sécurité Incendie SSIAP 3",
  ],
  prerequisites: [
    "SSIAP 3 n'ayant pas dépassé la date limite de recyclage",
    "Justifier de 1607 heures d'activité sur 36 mois",
    "SST ou équivalent à jour",
    "Certificat médical de moins de 3 mois",
  ],
  presentation: "Le recyclage SSIAP 3 permet de maintenir et actualiser les compétences des chefs de service tous les 3 ans.",
  objectives: [
    "Actualiser ses connaissances réglementaires",
    "Maintenir ses compétences de management",
    "Perfectionner son rôle de conseil auprès de la direction",
  ],
  programme: {
    totalHours: 21,
    modules: [
    {
      title: "Réglementation et documents administratifs",
      hours: 7,
      content: [],
    },
    {
      title: "Management et gestion budgétaire",
      hours: 7,
      content: [],
    },
    {
      title: "Analyse de risques et projets",
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
    "Attestation de recyclage SSIAP 3 valable 3 ans",
  ],
  careerOutcomes: [
    "Maintien de la qualification Chef de Service SSIAP 3.",
  ],
  accessibility: "Nos locaux sont accessibles aux personnes à mobilité réduite. Pour toute situation de handicap, merci de nous contacter afin d'étudier les adaptations possibles (aménagement du parcours, des supports pédagogiques, de la durée, etc.). Référent PSH M. BALLO : 06.40.41.62.10",
};
