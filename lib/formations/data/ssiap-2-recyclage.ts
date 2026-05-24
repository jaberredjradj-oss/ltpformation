import type { Formation } from "@/lib/formations/types";

export const formation: Formation = {
  slug: "ssiap-2-recyclage",
  title: "SSIAP 2 — Recyclage",
  shortTitle: "SSIAP 2 Recyclage",
  category: "securite-incendie",
  categoryLabel: "Sécurité incendie",
  type: "recyclage",
  typeLabel: "Recyclage",
  level: "2",
  durationHours: 14,
  durationLabel: "14 heures (2 jours)",
  price: {
    amount: 234,
    currency: "EUR",
    label: "234,00 € TTC par participant",
    shortLabel: "234,00 € TTC",
  },
  cpfEligible: true,
  certificationCode: "RS5642",
  certifications: ["Qualiopi"],
  summary: "Le recyclage SSIAP 2 permet de maintenir et actualiser les compétences des chefs d'équipe tous les 3 ans.",
  imageKey: "incendie",
  pdfFilename: "ssiap-2-recyclage.pdf",
  pdfUrl: "/pdfs/formations/ssiap-2-recyclage.pdf",
  pdfAvailable: true,
  contentStatus: "published",
  publicConcerned: [
    "Chefs d'équipe SSIAP 2 en activité devant se recycler tous les 3 ans",
  ],
  prerequisites: [
    "Justificatif de 1607 heures travaillées en SSIAP 2 sur 36 mois",
    "Qualification SSIAP 2",
    "SST ou PSE en cours de validité ou PSC 1 de moins de 2 ans",
  ],
  presentation: "Le recyclage SSIAP 2 permet de maintenir et actualiser les compétences des chefs d'équipe tous les 3 ans.",
  objectives: [
    "Actualiser ses connaissances réglementaires",
    "Maintenir ses compétences de chef d'équipe",
    "Perfectionner ses techniques managériales",
  ],
  programme: {
    totalHours: 14,
    modules: [
    {
      title: "Réglementation et évolutions",
      hours: 5,
      content: [],
    },
    {
      title: "Gestion d'équipe et du PC sécurité",
      hours: 5,
      content: [],
    },
    {
      title: "Exercices pratiques",
      hours: 4,
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
    "Attestation de recyclage SSIAP 2 valable 3 ans",
  ],
  careerOutcomes: [
    "Maintien de la qualification Chef d'Équipe SSIAP 2.",
  ],
  accessibility: "Nos locaux sont accessibles aux personnes à mobilité réduite. Pour toute situation de handicap, merci de nous contacter afin d'étudier les adaptations possibles (aménagement du parcours, des supports pédagogiques, de la durée, etc.). Référent PSH M. BALLO : 06.40.41.62.10",
};
