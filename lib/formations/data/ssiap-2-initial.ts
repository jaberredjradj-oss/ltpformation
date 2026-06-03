import type { Formation } from "@/lib/formations/types";

export const formation: Formation = {
  slug: "ssiap-2-initial",
  title: "SSIAP 2 — Formation initiale",
  shortTitle: "SSIAP 2 Initial",
  category: "securite-incendie",
  categoryLabel: "Sécurité incendie",
  type: "initial",
  typeLabel: "Initial",
  level: "2",
  durationHours: 77,
  durationLabel: "77 heures (11 jours)",
  price: {
    amount: 1389,
    currency: "EUR",
    label: "1 389,00 € TTC par participant",
    shortLabel: "1 389,00 € TTC",
  },
  cpfEligible: true,
  certificationCode: "RS5642",
  certifications: ["Qualiopi"],
  summary: "La formation SSIAP 2 permet d'accéder à la fonction de Chef d'Équipe de Sécurité Incendie dans les ERP et IGH.",
  imageKey: "incendie",
  pdfFilename: "ssiap-2-initial.pdf",
  pdfUrl: "/pdfs/formations/ssiap-2-initial.pdf",
  pdfAvailable: true,
  contentStatus: "published",
  publicConcerned: [
    "Personne titulaire du diplôme SSIAP 1 souhaitant assurer la fonction de SSIAP 2",
  ],
  prerequisites: [
    "Être titulaire du SSIAP 1 avec plus de 1607 heures de travail sur 3 ans",
    "SST valide",
    "Attestation d'aptitude physique de moins de 3 mois",
  ],
  presentation: "La formation SSIAP 2 permet d'accéder à la fonction de Chef d'Équipe de Sécurité Incendie dans les ERP et IGH.",
  objectives: [
    "Encadrer et former une équipe de sécurité incendie",
    "Diriger le poste de sécurité lors des sinistres",
    "Gérer les opérations d'entretien des moyens de secours",
    "Tenir les registres réglementaires",
  ],
  programme: {
    totalHours: 77,
    modules: [
    {
      title: "Rôle et missions du chef d'équipe",
      hours: 15,
      content: [],
    },
    {
      title: "Manipulation du système de sécurité incendie",
      hours: 17,
      content: [],
    },
    {
      title: "Hygiène et sécurité en matière de sécurité incendie",
      hours: 10,
      content: [],
    },
    {
      title: "Chef du poste central de sécurité en situation de crise",
      hours: 28,
      content: [],
    },
    {
      title: "Exercices pratiques",
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
    "Épreuve écrite (QCM) et épreuve pratique.",
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
    "Diplôme SSIAP 2 (sous réserve de réussite)",
  ],
  careerOutcomes: [
    "Chef d'Équipe de Sécurité Incendie. Évolution possible vers SSIAP 3 après 3 ans.",
  ],
  accessibility: "Nos locaux sont accessibles aux personnes à mobilité réduite. Pour toute situation de handicap, merci de nous contacter afin d'étudier les adaptations possibles (aménagement du parcours, des supports pédagogiques, de la durée, etc.). Référent PSH M. BALLO : 06.40.41.62.10",
};
