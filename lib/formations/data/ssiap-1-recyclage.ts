import type { Formation } from "@/lib/formations/types";

export const formation: Formation = {
  slug: "ssiap-1-recyclage",
  title: "SSIAP 1 — Recyclage",
  shortTitle: "SSIAP 1 Recyclage",
  category: "securite-incendie",
  categoryLabel: "Sécurité incendie",
  type: "recyclage",
  typeLabel: "Recyclage",
  level: "1",
  durationHours: 14,
  durationLabel: "14 heures (2 jours)",
  price: {
    amount: 228,
    currency: "EUR",
    label: "228,00 € TTC par participant",
    shortLabel: "228,00 € TTC",
  },
  cpfEligible: true,
  certificationCode: "RS5641",
  certifications: ["Qualiopi"],
  summary: "Le recyclage SSIAP 1 permet de maintenir et actualiser les compétences des agents de sécurité incendie tous les 3 ans conformément à la réglementation.",
  imageKey: "incendie",
  pdfFilename: "ssiap-1-recyclage.pdf",
  pdfUrl: "/pdfs/formations/ssiap-1-recyclage.pdf",
  pdfAvailable: true,
  contentStatus: "published",
  publicConcerned: [
    "Titulaires du SSIAP 1 depuis moins de 3 ans souhaitant se recycler",
  ],
  prerequisites: [
    "Avoir le SSIAP 1 n'ayant pas dépassé sa date de validité triennale",
    "PSC 1 de moins de 2 ans ou SST en cours de validité",
  ],
  presentation: "Le recyclage SSIAP 1 permet de maintenir et actualiser les compétences des agents de sécurité incendie tous les 3 ans conformément à la réglementation.",
  objectives: [
    "Actualiser ses connaissances en matière de sécurité incendie",
    "Maintenir ses compétences opérationnelles",
    "Se tenir informé des évolutions réglementaires",
  ],
  programme: {
    totalHours: 14,
    modules: [
    {
      title: "Fondamentaux de sécurité incendie",
      hours: 5,
      content: [],
    },
    {
      title: "Prévention et moyens de secours",
      hours: 5,
      content: [],
    },
    {
      title: "Mises en situation pratiques",
      hours: 4,
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
    "Évaluation continue des acquis tout au long de la formation.",
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
    "Attestation de recyclage SSIAP 1 valable 3 ans",
  ],
  careerOutcomes: [
    "Maintien de la qualification SSIAP 1 pour exercer en ERP et IGH.",
  ],
  accessibility: "Nos locaux sont accessibles aux personnes à mobilité réduite. Pour toute situation de handicap, merci de nous contacter afin d'étudier les adaptations possibles (aménagement du parcours, des supports pédagogiques, de la durée, etc.). Référent PSH M. BALLO : 06.40.41.62.10",
};
