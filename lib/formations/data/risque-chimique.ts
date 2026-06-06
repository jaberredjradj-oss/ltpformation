import type { Formation } from "@/lib/formations/types";

export const formation: Formation = {
  slug: "risque-chimique",
  title: "Risque Chimique — Prévention des agents chimiques dangereux",
  shortTitle: "Risque Chimique",
  category: "habilitation-electrique",
  categoryLabel: "Prévention des risques",
  type: "certification",
  typeLabel: "Certification",
  level: null,
  durationHours: 7,
  durationLabel: "7 heures (1 journée)",
  price: {
    amount: 0,
    currency: "EUR",
    label: "Tarif sur devis",
    shortLabel: "Sur devis",
    note: "Établi selon l'effectif et le format (intra ou inter). Possibilités de financement OPCO.",
  },
  cpfEligible: false,
  certifications: ["Qualiopi"],
  summary:
    "Acquérir les bases en prévention du risque chimique : identifier les agents chimiques dangereux et appliquer les règles de prévention. Formation conforme aux exigences du Code du travail (articles R. 4412-1 et suivants).",
  imageKey: "habilitation",
  pdfFilename: "risque-chimique.pdf",
  pdfUrl: "/pdfs/formations/risque-chimique.pdf",
  pdfAvailable: true,
  contentStatus: "published",
  publicConcerned: [
    "Opérateurs de production, agents de maintenance, agents d'entretien et de nettoyage",
    "Personnel de laboratoire, magasiniers, agents des collectivités",
    "Toute personne ayant à manipuler, utiliser, transvaser ou stocker des agents chimiques dangereux",
    "Toute personne exposée à des produits chimiques dans le cadre de son activité professionnelle",
  ],
  prerequisites: [
    "Aucun prérequis technique n'est nécessaire",
    "Compréhension du français oral et écrit suffisante pour lire les étiquettes et les fiches de données de sécurité",
  ],
  presentation:
    "Le risque chimique est l'un des principaux risques professionnels en France : de nombreux salariés sont exposés, au moins occasionnellement, à des produits chimiques dangereux. Ces agents peuvent provoquer des intoxications, brûlures, allergies, maladies respiratoires et, pour les substances CMR, des pathologies graves. Former ses salariés permet de réduire les accidents et les maladies professionnelles, de répondre à une obligation légale (évaluation du risque chimique – article R. 4412-5 – et information/formation des travailleurs exposés) et d'ancrer durablement les bons réflexes.",
  objectives: [
    "Identifier les risques liés aux agents chimiques : toxicité, corrosivité, inflammabilité, risque CMR",
    "Reconnaître et exploiter les informations de danger : étiquetage CLP et fiche de données de sécurité (FDS)",
    "Appliquer les règles de base de la prévention : hiérarchie des mesures (suppression, substitution, protection collective, protection individuelle)",
    "Respecter les règles de stockage et de manipulation : bonnes pratiques et incompatibilités entre produits",
    "Adopter la bonne conduite en cas d'incident : déversement, fuite, contact ou intoxication",
    "Participer à la démarche de prévention de l'entreprise",
  ],
  programme: {
    totalHours: 7,
    modules: [
      {
        title: "Enjeux et cadre réglementaire",
        content: [],
      },
      {
        title: "Connaître les agents chimiques dangereux",
        content: [],
      },
      {
        title: "Identifier les dangers",
        content: [],
      },
      {
        title: "Les mesures de prévention",
        content: [],
      },
      {
        title: "Stockage, manipulation et hygiène",
        content: [],
      },
      {
        title: "Conduite à tenir en cas d'incident",
        content: [],
      },
    ],
  },
  registration: [
    "Demande de devis : l'entreprise (ou le participant) formule sa demande par téléphone, par e-mail ou via notre formulaire de contact.",
    "Validation de l'inscription confirmée à réception du devis signé et, le cas échéant, de l'accord de prise en charge de l'OPCO.",
    "Convention de formation établie conformément aux exigences légales (objet, durée, contenu, modalités, coût).",
    "Convocation adressée aux participants avant la session (date, horaire, lieu, modalités pratiques).",
    "Formation intra-entreprise (adaptée aux produits et postes de votre entreprise) ou inter-entreprises.",
    "LT PROTECT FORMATION M. BALLO Téléphone : 06.40.41.62.10 Lieu de formation : Voisins-Le-Bretonneux (78)",
  ],
  evaluation: [
    "Positionnement initial : questionnaire ou échange en début de session.",
    "Évaluation continue : compréhension lors des échanges et des mises en situation.",
    "Évaluation finale : vérification de l'atteinte des objectifs en fin de formation.",
  ],
  pedagogicalTeam: [
    "Formateur expérimenté en prévention des risques professionnels.",
    "Connaissance du terrain et des situations d'exposition au risque chimique.",
    "Compétences pédagogiques reconnues, garantissant une transmission claire et opérationnelle.",
  ],
  pedagogicalMeans: [
    "Supports numériques pédagogiques",
    "Vidéoprojecteur pour les apports théoriques et les illustrations",
    "Études de cas et exemples d'étiquettes et de FDS",
    "Remise d'un mémo de synthèse à chaque stagiaire",
  ],
  followUp: [
    "Feuilles d'émargement signées par demi-journée",
    "Évaluations intermédiaires au fil de la session",
    "Évaluation finale des connaissances",
    "Bilan pédagogique synthétisant le déroulé et les résultats",
    "Questionnaire de satisfaction remis aux participants",
    "Attestation de formation individuelle délivrée à chaque stagiaire",
  ],
  careerOutcomes: [
    "Renforcer ses compétences en prévention du risque chimique",
    "Participer activement à la démarche sécurité de l'entreprise",
    "Réduire le risque d'accident et de maladie professionnelle lié aux produits chimiques",
    "Développer une culture de la prévention au sein des équipes",
    "Première étape avant des parcours plus spécialisés (habilitation Risque chimique niveau 1 ou 2)",
  ],
  accessibility:
    "Nos locaux sont accessibles aux personnes à mobilité réduite. Pour toute situation de handicap, merci de nous contacter afin d'étudier les adaptations possibles (aménagement du parcours, des supports pédagogiques, de la durée, etc.). Référent PSH M. BALLO : 06.40.41.62.10",
};
