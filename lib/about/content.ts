import { SITE, CERTIFICATIONS } from "@/lib/constants";
import { TRAINING_IMAGES } from "@/lib/training-images";

export const ABOUT_HERO = {
  eyebrow: "En savoir plus sur nous",
  lines: ["Un centre de formation", "opérationnel et exigeant."],
  lead:
    "LT Protect Formation forme les professionnels de la prévention — incendie, secours, sûreté et habilitations — dans un cadre structuré, humain et orienté terrain.",
} as const;

export const ABOUT_INTRO = {
  quote: {
    text: "Chaque parcours est pensé pour transmettre savoir-faire, conformité et confiance sur le terrain.",
    author: "LT Protect Formation",
    role: "Centre de formation certifié",
  },
  paragraphs: [
    `${SITE.name} accompagne les entreprises, les candidats en reconversion et les professionnels en montée en compétences. Notre approche combine rigueur réglementaire, pédagogie immersive et exigence opérationnelle.`,
    "Chaque parcours est conçu pour installer la confiance, la maîtrise des gestes professionnels et la capacité d'agir en situation réelle.",
  ],
} as const;

export const ABOUT_LOCATION = {
  eyebrow: "Notre environnement",
  title: "Un centre pensé pour apprendre sereinement",
  description:
    "Installé à Voisins-le-Bretonneux, notre centre de formation accueille stagiaires et entreprises dans un cadre professionnel, lumineux et accessible.",
  addressLabel: `${SITE.address.street}, ${SITE.address.city}`,
  accessNote: SITE.address.access,
  highlights: [
    "Salles de formation spacieuses et professionnelles",
    "Espaces lumineux avec grandes baies vitrées",
    "Environnement calme, sécurisé et accueillant",
    "Parking accessible et spacieux",
    "Accueil confortable pour les stagiaires et visiteurs",
    "Centre situé au premier étage — accès facilité",
    "Conditions modernes favorisant la concentration",
  ],
  image: TRAINING_IMAGES.classroom,
  imageAlt: "Salle de formation lumineuse — LT Protect Formation, Voisins-le-Bretonneux",
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
  framing: [
    "Exercices encadrés par des formateurs expérimentés",
    "Protocoles de sécurité strictement appliqués",
    "Simulations autorisées et professionnellement cadrées",
    "Réalisme opérationnel au service de la confiance",
  ],
  image: TRAINING_IMAGES.intervention,
  imageAlt: "Exercice opérationnel encadré — formation LT Protect",
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
    "Pédagogie exigeante et bienveillante",
    "Suivi individualisé des parcours",
    "Accompagnement des reconversions et des montées en compétences",
    "Préparation concrète aux responsabilités professionnelles",
  ],
  audiences: [
    "Futurs stagiaires en quête de sérieux et de structure",
    "Entreprises recherchant un partenaire formation fiable",
    "Professionnels souhaitant consolider leurs compétences",
  ],
  image: TRAINING_IMAGES.aboutTeam,
  imageAlt: "Formateurs LT Protect Formation en atelier pédagogique",
} as const;

export const ABOUT_CTA = {
  eyebrow: "Passer à l'action",
  title: "Construisons votre parcours ensemble",
  description:
    "Que vous soyez candidat individuel ou responsable formation en entreprise, notre équipe vous oriente vers la session, le financement et le format adaptés.",
} as const;
