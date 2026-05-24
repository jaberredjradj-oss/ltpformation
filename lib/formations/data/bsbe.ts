import type { Formation } from "@/lib/formations/types";

export const formation: Formation = {
  slug: "bsbe",
  title: "BSBE — Habilitation électrique",
  shortTitle: "BSBE",
  category: "habilitation-electrique",
  categoryLabel: "Habilitation électrique",
  type: "certification",
  typeLabel: "Certification",
  level: null,
  durationHours: 14,
  durationLabel: "14 heures (2 jours)",
  price: {
    amount: 200,
    currency: "EUR",
    label: "200,00 € TTC par participant",
    shortLabel: "200,00 € TTC",
  },
  cpfEligible: false,
  certifications: ["Qualiopi"],
  summary: "Apporter les compétences en sécurité nécessaires au personnel d'entreprise devant réaliser des travaux non-électriques dans un environnement électrique potentiellement dangereux.",
  imageKey: "habilitation",
  pdfFilename: "bsbe.pdf",
  pdfUrl: "/pdfs/formations/bsbe.pdf",
  pdfAvailable: true,
  contentStatus: "published",
  publicConcerned: [
    "Personnel travaillant dans un environnement de risques électriques, ou effectuant des travaux d'ordre non électrique",
  ],
  prerequisites: [
    "Aucun",
  ],
  presentation: "Apporter les compétences en sécurité nécessaires au personnel d'entreprise devant réaliser des travaux non-électriques dans un environnement électrique potentiellement dangereux.",
  objectives: [
    "Connaître la réglementation en rapport avec l'électricité et les risques présentés par les installations",
    "Connaître les dispositions de la norme NFC 18-510",
    "Obtenir une attestation de formation permettant à l'employeur de délivrer un titre d'habilitation",
  ],
  programme: {
    totalHours: 14,
    modules: [
    {
      title: "Connaître les notions élémentaires liées à l’électricité",
      hours: 4,
      content: [],
    },
    {
      title: "Travailler en sécurité dans un environnement électrique",
      hours: 6,
      content: [],
    },
    {
      title: "Réagir face à un accident",
      hours: 2,
      content: [],
    }
    ],
  },
  registration: [
    "De 4 à 10 participants. Formation en présentiel à Voisins-Le-Bretonneux.",
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
    "QCM et exercices pratiques. Remise d'un avis d'habilitation pour l'employeur.",
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
    "Attestation de formation et avis d'habilitation",
  ],
  careerOutcomes: [
    "Permet de travailler en sécurité dans un environnement électrique.",
  ],
  accessibility: "Nos locaux sont accessibles aux personnes à mobilité réduite. Pour toute situation de handicap, merci de nous contacter afin d'étudier les adaptations possibles (aménagement du parcours, des supports pédagogiques, de la durée, etc.). Référent PSH M. BALLO : 06.40.41.62.10",
};
