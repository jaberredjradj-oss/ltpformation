import { SITE, CERTIFICATIONS } from "@/lib/constants";
import { TRAINING_IMAGES } from "@/lib/training-images";

export const ABOUT_HERO = {
  eyebrow: "En savoir plus sur nous",
  title:
    "Votre organisme de formation sécurité à Voisins-le-Bretonneux, dans les Yvelines (78)",
  lead:
    "LT Protect Formation prépare les professionnels de la sécurité — incendie (SSIAP 1, 2, 3), secours (SST), sûreté (CQP APS) et prévention des risques (H0B0) — à Voisins-le-Bretonneux (78), au cœur de Saint-Quentin-en-Yvelines. Des formations conformes aux référentiels en vigueur, encadrées par des formateurs issus du métier, accessibles depuis Montigny-le-Bretonneux, Guyancourt, Versailles, Trappes et toute l'Île-de-France.",
} as const;

export const ABOUT_INTRO = {
  quote: {
    text: "En sécurité, la réactivité s'apprend en amont : nous formons des professionnels prêts à agir avec méthode et sang-froid.",
    author: "LT Protect Formation",
    role: "Centre de formation certifié",
  },
  paragraphs: [
    "Depuis 2023, LT Protect Formation accompagne entreprises, salariés et particuliers en reconversion ou en montée en compétences. Nos parcours allient pratique en conditions réelles, respect des référentiels et accompagnement individualisé, de l'inscription jusqu'à la validation de la qualification.",
  ],
} as const;

export const ABOUT_LOCATION = {
  eyebrow: "Notre environnement",
  title: "Un centre pensé pour apprendre sereinement",
  description:
    "Installé à Voisins-le-Bretonneux, notre centre de formation accueille stagiaires et entreprises dans un cadre professionnel, lumineux et accessible. Facilement accessible depuis Montigny-le-Bretonneux, Guyancourt, Versailles, Trappes et Élancourt, notre centre est au cœur du bassin d'emploi des Yvelines (78).",
  addressLabel: `${SITE.address.street}, ${SITE.address.city}`,
  accessNote: SITE.address.access,
  highlights: [
    "Salles de formation spacieuses et professionnelles",
    "Espaces lumineux avec grandes baies vitrées",
    "Environnement calme, sécurisé et accueillant",
    "Parking accessible et spacieux",
    "Accueil confortable pour les stagiaires et visiteurs",
    "Centre situé au premier étage — accès facilité",
  ],
  image: TRAINING_IMAGES.classroom,
  imageAlt:
    "Salle de formation SSIAP et secourisme LT Protect Formation, Saint-Quentin-en-Yvelines (78)",
} as const;

export const ABOUT_TRAINING = {
  eyebrow: "Pédagogie terrain",
  title: "Former autrement que par la théorie seule",
  description:
    "Chez LT Protect Formation, l'apprentissage ne se limite pas aux supports de cours. Nos stagiaires s'exercent dans des conditions proches du réel, encadrées et sécurisées.",
  highlights: [
    "Exercices pratiques et mises en situation réalistes",
    "Simulations opérationnelles encadrées",
    "Exercices incendie supervisés et réglementés",
    "Scénarios d'intervention professionnels",
    "Équipements de sécurité adaptés aux protocoles",
    "Préparation concrète aux responsabilités de terrain",
  ],
  framing: [],
  image: TRAINING_IMAGES.intervention,
  imageAlt:
    "Exercice pratique sécurité incendie SSIAP LT Protect Formation, Yvelines (78)",
} as const;

export const ABOUT_APPROVALS = {
  eyebrow: "Agréments & cadre professionnel",
  title: "Un organisme structuré, reconnu et conforme",
  description:
    "LT Protect Formation s'appuie sur un cadre qualité certifié et des processus rigoureux pour délivrer des formations exigeantes, y compris les modules pratiques réglementés.",
  points: [
    "Certification Qualiopi — qualité des actions de formation",
    "Certification Qualianor — reconnaissance et traçabilité des compétences",
    "Programmes alignés sur les référentiels professionnels en vigueur",
    "Encadrement des exercices pratiques selon les exigences du métier",
    "Organisation structurée pour les entreprises comme pour les particuliers",
  ],
  certifications: CERTIFICATIONS.filter((cert) => cert.id !== "cpf"),
} as const;

export const ABOUT_TRAINERS = {
  eyebrow: "L'équipe pédagogique",
  title: "Des formateurs expérimentés, proches du terrain",
  description:
    "Nos formateurs transmettent bien plus qu'un programme : ils partagent une culture professionnelle, une exigence opérationnelle et un accompagnement humain.",
  highlights: [
    "Formateurs issus du monde opérationnel",
    "Expertise incendie, secours, sûreté et habilitations",
    "Des formateurs exigeants mais à l'écoute",
    "Suivi individualisé des parcours",
    "Accompagnement des reconversions et des montées en compétences",
  ],
  audiences: [
    "Les futurs stagiaires qui souhaitent une formation sérieuse et encadrée",
    "Les entreprises à la recherche d'un partenaire fiable pour former leurs équipes",
    "Les professionnels qui veulent renforcer ou actualiser leurs compétences",
  ],
  image: TRAINING_IMAGES.aboutTeam,
  imageAlt:
    "Formateurs sécurité incendie LT Protect Formation, Voisins-le-Bretonneux, Saint-Quentin-en-Yvelines",
} as const;

export const ABOUT_CTA = {
  eyebrow: "Passer à l'action",
  title: "Construisons votre parcours ensemble",
  description:
    "Que vous soyez candidat individuel ou responsable formation en entreprise, notre équipe vous oriente vers la session, le financement et le format adaptés.",
} as const;
