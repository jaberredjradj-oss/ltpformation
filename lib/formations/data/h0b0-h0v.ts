import type { Formation } from "@/lib/formations/types";

export const formation: Formation = {
  slug: "h0b0-h0v",
  title: "H0B0-H0V — Habilitation électrique",
  shortTitle: "H0B0-H0V",
  category: "habilitation-electrique",
  categoryLabel: "Habilitation électrique",
  type: "certification",
  typeLabel: "Certification",
  level: null,
  durationHours: 7,
  durationLabel: "7 heures (1 jours)",
  price: {
    amount: 130,
    currency: "EUR",
    label: "130,00 € TTC par participant",
    shortLabel: "130,00 € TTC",
  },
  cpfEligible: false,
  certifications: ["Qualiopi"],
  summary: "Apporter les compétences en sécurité nécessaires au personnel d'entreprise devant réaliser des travaux non-électriques dans un environnement électrique potentiellement dangereux.",
  imageKey: "habilitation",
  pdfFilename: "h0b0-h0v.pdf",
  pdfUrl: "/pdfs/formations/h0b0-h0v.pdf",
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
    totalHours: 7,
    modules: [
    {
      title: "Risques électriques et accidents",
      hours: 2,
      content: [],
    },
    {
      title: "Conduite à tenir pour maîtriser les risques",
      hours: 3,
      content: [],
    },
    {
      title: "Réagir face à un accident électrique",
      hours: 1,
      content: [],
    },
    {
      title: "Évaluation des connaissances",
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
