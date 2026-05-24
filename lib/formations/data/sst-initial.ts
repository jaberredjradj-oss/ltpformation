import type { Formation } from "@/lib/formations/types";

export const formation: Formation = {
  slug: "sst-initial",
  title: "SST — Formation initiale",
  shortTitle: "SST Initial",
  category: "secourisme",
  categoryLabel: "Secourisme",
  type: "initial",
  typeLabel: "Initial",
  level: null,
  durationHours: 14,
  durationLabel: "14 heures (2 jours)",
  price: {
    amount: 250,
    currency: "EUR",
    label: "250,00 € TTC par participant",
    shortLabel: "250,00 € TTC",
  },
  cpfEligible: false,
  certifications: ["Qualiopi"],
  summary: "Cette formation permet à l'employeur de répondre à ses obligations réglementaires en lien avec l'organisation des secours dans son entreprise. La prévention des risques est abordée dans le contenu enseigné.",
  imageKey: "secourisme",
  pdfFilename: "sst-initial.pdf",
  pdfUrl: "/pdfs/formations/sst-initial.pdf",
  pdfAvailable: true,
  contentStatus: "published",
  publicConcerned: [
    "Tout public",
  ],
  prerequisites: [
    "Aucun",
  ],
  presentation: "Cette formation permet à l'employeur de répondre à ses obligations réglementaires en lien avec l'organisation des secours dans son entreprise. La prévention des risques est abordée dans le contenu enseigné.",
  objectives: [
    "Intervenir de façon adaptée face à une situation d'accident de travail",
    "Mettre en application ses compétences de SST au service de la prévention des risques",
    "Contribuer à la mise en œuvre d'actions de prévention dans l'entreprise",
  ],
  programme: {
    totalHours: 14,
    modules: [
    {
      title: "Le sauveteur secouriste du travail",
      hours: 1,
      content: [],
    },
    {
      title: "Rechercher les dangers persistants pour protéger",
      hours: 2,
      content: [],
    },
    {
      title: "Examiner la victime et faire alerter",
      hours: 2,
      content: [],
    },
    {
      title: "Secourir : hémorragies, étouffement, malaises",
      hours: 5,
      content: [],
    },
    {
      title: "Secourir : traumatismes, brûlures, plaies",
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
    "Évaluation continue et épreuves certificatives pratiques.",
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
    "Certificat SST valable 24 mois (sous réserve de réussite)",
  ],
  careerOutcomes: [
    "Sauveteur Secouriste du Travail. Contribue à la prévention des risques dans l'entreprise.",
  ],
  accessibility: "Nos locaux sont accessibles aux personnes à mobilité réduite. Pour toute situation de handicap, merci de nous contacter afin d'étudier les adaptations possibles (aménagement du parcours, des supports pédagogiques, de la durée, etc.). Référent PSH M. BALLO : 06.40.41.62.10",
};
