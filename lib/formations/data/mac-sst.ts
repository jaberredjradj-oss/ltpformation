import type { Formation } from "@/lib/formations/types";

export const formation: Formation = {
  slug: "mac-sst",
  title: "MAC SST — Maintien et actualisation des compétences",
  shortTitle: "MAC SST",
  category: "secourisme",
  categoryLabel: "Secourisme",
  type: "mac",
  typeLabel: "MAC",
  level: null,
  durationHours: 7,
  durationLabel: "7 heures (1 jours)",
  price: {
    amount: 150,
    currency: "EUR",
    label: "150,00 € TTC par participant",
    shortLabel: "150,00 € TTC",
  },
  cpfEligible: false,
  certifications: ["Qualiopi"],
  summary: "Cette formation permet de répondre à l'obligation légale de maintien et d'actualisation des compétences pour le personnel certifié SST et d'éviter une perte de qualification.",
  imageKey: "secourisme",
  pdfFilename: "mac-sst.pdf",
  pdfUrl: "/pdfs/formations/mac-sst.pdf",
  pdfAvailable: true,
  contentStatus: "published",
  publicConcerned: [
    "Toute personne titulaire d'un certificat SST ou APS en cours de validité ou non",
  ],
  prerequisites: [
    "Être titulaire du certificat Sauveteur Secouriste du Travail ou équivalent",
  ],
  presentation: "Cette formation permet de répondre à l'obligation légale de maintien et d'actualisation des compétences pour le personnel certifié SST et d'éviter une perte de qualification.",
  objectives: [
    "Actualiser ses connaissances en matière de secourisme et de prévention",
    "Maintenir ses compétences de SST pour adopter un comportement adapté en cas d'accident",
    "Mettre en application ses compétences au service de la prévention des risques professionnels",
  ],
  programme: {
    totalHours: 7,
    modules: [
    {
      title: "Retour d'expérience et actualisation des connaissances",
      hours: 2,
      content: [],
    },
    {
      title: "Prévention des risques professionnels",
      hours: 2,
      content: [],
    },
    {
      title: "Protection, examen et alerte",
      hours: 1,
      content: [],
    },
    {
      title: "Secourir les victimes - Cas pratiques",
      hours: 2,
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
    "Évaluation continue et mise en situation pratique.",
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
    "Certificat SST valable 24 mois (sous réserve de réussite aux épreuves)",
  ],
  careerOutcomes: [
    "Maintien de la qualification SST et contribution à la prévention des risques dans l'entreprise.",
  ],
  accessibility: "Nos locaux sont accessibles aux personnes à mobilité réduite. Pour toute situation de handicap, merci de nous contacter afin d'étudier les adaptations possibles (aménagement du parcours, des supports pédagogiques, de la durée, etc.). Référent PSH M. BALLO : 06.40.41.62.10",
};
