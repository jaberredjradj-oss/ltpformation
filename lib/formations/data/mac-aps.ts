import type { Formation } from "@/lib/formations/types";

export const formation: Formation = {
  slug: "mac-aps",
  title: "MAC APS — Maintien et actualisation des compétences",
  shortTitle: "MAC APS",
  category: "surete",
  categoryLabel: "Sûreté",
  type: "mac",
  typeLabel: "MAC",
  level: null,
  durationHours: 28,
  durationLabel: "28 heures (4 jours)",
  price: {
    amount: 400,
    currency: "EUR",
    label: "400,00 € TTC par participant",
    shortLabel: "400,00 € TTC",
  },
  cpfEligible: false,
  certifications: ["Qualiopi"],
  summary: "La formation MAC APS permet à l'agent de sécurité de maintenir et actualiser ses compétences nécessaires au renouvellement de la carte professionnelle pour exercer en qualité d'agent de prévention et de sécurité.",
  imageKey: "surete",
  pdfFilename: "mac-aps.pdf",
  pdfUrl: "/pdfs/formations/mac-aps.pdf",
  pdfAvailable: true,
  contentStatus: "published",
  publicConcerned: [
    "Agent de sécurité devant renouveler sa carte professionnelle",
  ],
  prerequisites: [
    "Maîtriser la langue française, minimum niveau B1",
    "Être titulaire de la carte professionnelle",
  ],
  presentation: "La formation MAC APS permet à l'agent de sécurité de maintenir et actualiser ses compétences nécessaires au renouvellement de la carte professionnelle pour exercer en qualité d'agent de prévention et de sécurité.",
  objectives: [
    "Maintenir et actualiser les compétences nécessaires au renouvellement de la carte professionnelle",
    "Actualiser ses connaissances en secourisme et cadre juridique",
    "Gérer les conflits et maîtriser les mesures d'inspection filtrage",
    "Connaître et prévenir les risques terroristes",
  ],
  programme: {
    totalHours: 28,
    modules: [
    {
      title: "Gestes élémentaires de premiers secours",
      hours: 7,
      content: [],
    },
    {
      title: "Cadre juridique et déontologie",
      hours: 7,
      content: [],
    },
    {
      title: "Compétences opérationnelles générales",
      hours: 7,
      content: [],
    },
    {
      title: "Risques terroristes et compétences spécifiques",
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
    "Test d'évaluation en fin de formation.",
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
    "Attestation de maintien et actualisation des compétences",
  ],
  careerOutcomes: [
    "Renouvellement de la carte professionnelle d'agent de sécurité.",
  ],
  accessibility: "Nos locaux sont accessibles aux personnes à mobilité réduite. Pour toute situation de handicap, merci de nous contacter afin d'étudier les adaptations possibles (aménagement du parcours, des supports pédagogiques, de la durée, etc.). Référent PSH M. BALLO : 06.40.41.62.10",
};
