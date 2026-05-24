import type { Formation } from "@/lib/formations/types";

export const formation: Formation = {
  slug: "epi",
  title: "EPI — Équipier de première intervention",
  shortTitle: "EPI",
  category: "securite-incendie",
  categoryLabel: "Sécurité incendie",
  type: "certification",
  typeLabel: "Certification",
  level: null,
  durationHours: 4,
  durationLabel: "4 heures (0,5 jours)",
  price: {
    amount: 150,
    currency: "EUR",
    label: "150,00 € TTC par participant",
    shortLabel: "150,00 € TTC",
  },
  cpfEligible: false,
  certifications: ["Qualiopi"],
  summary: "Maîtriser les connaissances théoriques et pratiques relatives à la prévention et la lutte contre les incendies afin d'être capable de donner l'alerte rapidement et d'utiliser les moyens de prévention.",
  imageKey: "professionals",
  pdfFilename: "epi.pdf",
  pdfUrl: "/pdfs/formations/epi.pdf",
  pdfAvailable: true,
  contentStatus: "published",
  publicConcerned: [
    "Tout public",
  ],
  prerequisites: [
    "Aucun",
  ],
  presentation: "Maîtriser les connaissances théoriques et pratiques relatives à la prévention et la lutte contre les incendies afin d'être capable de donner l'alerte rapidement et d'utiliser les moyens de prévention.",
  objectives: [
    "Connaître les moyens de secours",
    "Apprendre l'éclairage de sécurité",
    "Connaître le désenfumage",
    "Savoir utiliser les extincteurs et moyens de première intervention",
  ],
  programme: {
    totalHours: 4,
    modules: [
    {
      title: "Les causes de l'incendie et effets",
      hours: 1,
      content: [],
    },
    {
      title: "Le triangle du feu et classes de feu",
      hours: 1,
      content: [],
    },
    {
      title: "Les moyens d'extinction",
      hours: 1,
      content: [],
    },
    {
      title: "Exercices pratiques d'extinction",
      hours: 1,
      content: [],
    }
    ],
  },
  registration: [
    "De 4 à 10 participants. Formation en présentiel à Voisins-Le-Bretonneux au 26 Avenue René Duguay Trouin Bâtiment A 1ère étage.",
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
    "Questions orales ou écrites (QCM) et mise en situation pratique sur feu réel.",
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
    "Attestation de formation EPI",
  ],
  careerOutcomes: [
    "Cette formation permet d'acquérir les compétences nécessaires pour intervenir efficacement en cas de début d'incendie dans l'entreprise.",
  ],
  accessibility: "Nos locaux sont accessibles aux personnes à mobilité réduite. Pour toute situation de handicap, merci de nous contacter afin d'étudier les adaptations possibles (aménagement du parcours, des supports pédagogiques, de la durée, etc.). Référent PSH M. BALLO : 06.40.41.62.10",
};
