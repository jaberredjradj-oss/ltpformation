import type { Formation } from "@/lib/formations/types";

export const formation: Formation = {
  slug: "gestes-et-postures",
  title: "Gestes et Postures — Manutention et ergonomie",
  shortTitle: "Gestes et Postures",
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
    note: "Établi selon l'effectif et le format (intra ou inter).",
  },
  cpfEligible: false,
  certifications: ["Qualiopi"],
  summary:
    "Prévenir les troubles musculosquelettiques (TMS) et sécuriser les manutentions manuelles. Formation réglementaire répondant à l'obligation de l'employeur prévue par le Code du travail (article R. 4541-8).",
  imageKey: "habilitation",
  pdfFilename: "gestes-et-postures.pdf",
  pdfUrl: "/pdfs/formations/gestes-et-postures.pdf",
  pdfAvailable: true,
  contentStatus: "published",
  publicConcerned: [
    "Toute personne exposée, de manière occasionnelle ou régulière, à des manutentions manuelles ou à des postures contraignantes",
    "Toute personne exposée à des manutentions manuelles ou à des postures contraignantes dans le cadre de son activité professionnelle",
  ],
  prerequisites: [
    "Aucun prérequis technique n'est nécessaire pour suivre cette formation",
    "Compréhension du français oral et écrit suffisante pour suivre les apports théoriques et participer aux exercices",
    "Aptitude médicale compatible avec la réalisation des exercices pratiques de manutention",
  ],
  presentation:
    "Les manutentions manuelles et postures contraignantes sont parmi les premières causes d'atteinte à la santé au travail : selon l'Assurance Maladie – Risques professionnels (2024), elles provoquent environ la moitié des accidents du travail, et les TMS représentent près de 90 % des maladies professionnelles. Former ses salariés permet de réduire la fatigue, les douleurs et les accidents, de baisser l'absentéisme et la sinistralité, et de répondre à une obligation légale : le Code du travail impose à l'employeur de former les travailleurs exposés aux manutentions manuelles (article R. 4541-8) et d'évaluer ces risques dans le Document Unique (DUERP).",
  objectives: [
    "Identifier les risques liés à son activité physique : charges lourdes, gestes répétitifs, postures contraignantes",
    "Comprendre les mécanismes des troubles musculosquelettiques grâce à des notions d'anatomie et de physiologie",
    "Appliquer les principes de sécurité physique et d'économie d'effort",
    "Réaliser les manutentions de façon sécurisée : lever, porter, pousser, tirer et déplacer une charge seul ou à plusieurs",
    "Prévenir les accidents du travail en adoptant les bonnes pratiques",
    "Réduire les contraintes physiques en organisant son poste et en alternant les postures",
    "Participer à la démarche de prévention de son entreprise",
  ],
  programme: {
    totalHours: 7,
    modules: [
      {
        title: "Les enjeux de la prévention",
        content: [],
      },
      {
        title: "Anatomie et fonctionnement du corps humain",
        content: [],
      },
      {
        title: "Réglementation",
        content: [],
      },
      {
        title: "Les facteurs de risques",
        content: [],
      },
      {
        title: "Principes de sécurité physique et d'économie d'effort",
        content: [],
      },
      {
        title: "Exercices pratiques",
        content: [],
      },
      {
        title: "Analyse de situations réelles de travail",
        content: [],
      },
    ],
  },
  registration: [
    "Demande de devis : l'entreprise (ou le participant) formule sa demande par téléphone, par e-mail ou via notre formulaire de contact.",
    "Validation de l'inscription confirmée à réception du devis signé et, le cas échéant, de l'accord de prise en charge de l'OPCO.",
    "Convention de formation professionnelle établie conformément aux exigences légales (objet, durée, contenu, modalités, coût).",
    "Convocation adressée aux participants avant la session (date, horaire, lieu, modalités pratiques).",
    "Formation intra-entreprise (dans vos locaux, sur vos postes de travail réels) ou inter-entreprises (en session mutualisée).",
    "LT PROTECT FORMATION M. BALLO Téléphone : 06.40.41.62.10 Lieu de formation : Voisins-Le-Bretonneux (78)",
  ],
  evaluation: [
    "Positionnement initial : questionnaire ou échange en début de session.",
    "Évaluation continue : compréhension et bonne exécution des gestes lors des exercices pratiques.",
    "Évaluation finale : vérification de l'atteinte des objectifs en fin de formation.",
  ],
  pedagogicalTeam: [
    "Formateur expérimenté en prévention des risques professionnels.",
    "Expérience terrain des situations de manutention.",
    "Compétences pédagogiques reconnues, garantissant une transmission claire et opérationnelle.",
  ],
  pedagogicalMeans: [
    "Supports numériques pédagogiques",
    "Vidéoprojecteur pour les apports théoriques et les illustrations",
    "Exercices pratiques de manutention",
    "Études de cas concrètes",
    "Documentation remise à chaque stagiaire",
  ],
  followUp: [
    "Feuilles d'émargement signées par demi-journée",
    "Évaluations intermédiaires au fil de la session",
    "Évaluation finale des connaissances et des acquis pratiques",
    "Bilan pédagogique synthétisant le déroulé et les résultats de l'action",
    "Questionnaire de satisfaction remis aux participants",
    "Attestation de formation individuelle délivrée à chaque stagiaire",
  ],
  careerOutcomes: [
    "Renforcer ses compétences en prévention des risques liés à l'activité physique",
    "Participer activement à la démarche sécurité de l'entreprise et en devenir un relais",
    "Réduire le risque d'accident du travail lié aux manutentions et aux postures",
    "Améliorer sa qualité de vie au travail par la diminution de la fatigue et des douleurs",
    "Développer une culture de la prévention au sein des équipes",
  ],
  accessibility:
    "Nos locaux sont accessibles aux personnes à mobilité réduite. Pour toute situation de handicap, merci de nous contacter afin d'étudier les adaptations possibles (aménagement du parcours, des supports pédagogiques, de la durée, etc.). Référent PSH M. BALLO : 06.40.41.62.10",
};
