import type { Formation } from "@/lib/formations/types";

export const formation: Formation = {
  slug: "ssiap-3-initial",
  title: "SSIAP 3 — Formation initiale",
  shortTitle: "SSIAP 3 Initial",
  category: "securite-incendie",
  categoryLabel: "Sécurité incendie",
  type: "initial",
  typeLabel: "Initial",
  level: "3",
  durationHours: 216,
  durationLabel: "216 heures (31 jours)",
  price: {
    amount: 4200,
    currency: "EUR",
    label: "4 200,00 € TTC par participant",
    shortLabel: "4 200,00 € TTC",
  },
  cpfEligible: true,
  certificationCode: "RS5643",
  certifications: ["Qualiopi"],
  summary: "Le SSIAP 3 concerne toute personne souhaitant devenir Chef de Service de Sécurité Incendie au sein d'un établissement recevant du public (ERP) ou immeuble de grande hauteur (IGH).",
  imageKey: "incendie",
  pdfFilename: "ssiap-3-initial.pdf",
  pdfUrl: "/pdfs/formations/ssiap-3-initial.pdf",
  pdfAvailable: true,
  contentStatus: "published",
  publicConcerned: [
    "Chefs d'Équipe SSIAP 2 souhaitant devenir Chef de Service SSIAP 3 ou personne titulaire d'un diplôme de niveau 4",
  ],
  prerequisites: [
    "Être titulaire du SSIAP 2 avec 3 ans d'expérience ou diplôme de niveau 4",
    "Certificat de secourisme valide (SST)",
    "Attestation d'aptitude physique de moins de 3 mois",
  ],
  presentation: "Le SSIAP 3 concerne toute personne souhaitant devenir Chef de Service de Sécurité Incendie au sein d'un établissement recevant du public (ERP) ou immeuble de grande hauteur (IGH).",
  objectives: [
    "Conseiller le chef d'établissement en matière de sécurité incendie",
    "Diriger un service de sécurité incendie",
    "Intervenir dans la gestion des risques quotidiens et lors de travaux",
    "Assurer la correspondance avec les commissions de sécurité",
  ],
  programme: {
    totalHours: 216,
    modules: [
    {
      title: "Le feu et ses conséquences",
      hours: 12,
      content: [],
    },
    {
      title: "La sécurité incendie et les bâtiments",
      hours: 65,
      content: [],
    },
    {
      title: "La réglementation incendie",
      hours: 70,
      content: [],
    },
    {
      title: "Gestion des risques",
      hours: 23,
      content: [],
    },
    {
      title: "Conseil au chef d'établissement",
      hours: 6,
      content: [],
    },
    {
      title: "Correspondant des commissions de sécurité",
      hours: 6,
      content: [],
    },
    {
      title: "Management de l'équipe de sécurité",
      hours: 26,
      content: [],
    },
    {
      title: "Budget du service de sécurité",
      hours: 8,
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
    "Épreuve écrite (QCM et notice technique) et épreuve orale devant jury.",
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
    "Diplôme SSIAP 3 (sous réserve de réussite aux épreuves)",
  ],
  careerOutcomes: [
    "Chef de Service de Sécurité Incendie en ERP et IGH. Évolution possible vers Responsable Sécurité Sûreté.",
  ],
  accessibility: "Nos locaux sont accessibles aux personnes à mobilité réduite. Pour toute situation de handicap, merci de nous contacter afin d'étudier les adaptations possibles (aménagement du parcours, des supports pédagogiques, de la durée, etc.). Référent PSH M. BALLO : 06.40.41.62.10",
};
