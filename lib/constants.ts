import { TRAINING_IMAGES } from "@/lib/training-images";

export const SITE = {
  name: "LT Protect Formation",
  tagline: "Apprendre aujourd'hui, protéger demain",
  description:
    "Centre de formation professionnelle en sécurité incendie, sûreté, secourisme et habilitations réglementaires.",
  logo: "/logo.png",
  address: {
    street: "26 Av. René Duguay Trouin",
    building: "Bâtiment A – Premier Étage",
    city: "78960 Voisins-le-Bretonneux, France",
    full: "26 Av. René Duguay Trouin, Bâtiment A – Premier Étage, 78960 Voisins-le-Bretonneux, France",
    access: "Accès par l'entrée vitrée, 1er étage",
    mapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=26+Av.+Ren%C3%A9+Duguay+Trouin,+78960+Voisins-le-Bretonneux,+France",
    mapsEmbedUrl:
      "https://maps.google.com/maps?q=26+Av.+Ren%C3%A9+Duguay+Trouin,+78960+Voisins-le-Bretonneux,+France&z=15&output=embed",
  },
  phone: "09 73 88 06 48",
  mobile: "06 40 41 62 10",
  email: "ltprotect.formation@gmail.com",
  hours: "Lundi – Vendredi · 8h – 18h",
  onSiteNote: "Les inscriptions sur place se font uniquement le matin.",
  accessibility:
    "N'hésitez pas à nous contacter. Nous analyserons avec vous la meilleure formule de formation adaptée à votre situation.",
} as const;

export const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Formations", href: "/formations" },
  { label: "Planning", href: "/planning" },
  { label: "Pré-inscription", href: "/preinscription" },
  { label: "Contact", href: "/contact" },
  { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
] as const;

export const HERO_DOMAINS = [
  { label: "Sécurité incendie", href: "/formations" },
  { label: "Secourisme", href: "/formations" },
  { label: "Sûreté", href: "/formations" },
  { label: "Habilitation électrique", href: "/formations" },
] as const;

export const HERO_VISUALS = [
  {
    label: "Sécurité incendie",
    theme: "incendie" as const,
    subtitle: "SSIAP & prévention",
    image: TRAINING_IMAGES.incendie,
  },
  {
    label: "Secourisme",
    theme: "secourisme" as const,
    subtitle: "SST & secours",
    image: TRAINING_IMAGES.secourisme,
  },
  {
    label: "Sûreté",
    theme: "surete" as const,
    subtitle: "APS & surveillance",
    image: TRAINING_IMAGES.surete,
  },
  {
    label: "Habilitation électrique",
    theme: "habilitation" as const,
    subtitle: "NF C 18-510",
    image: TRAINING_IMAGES.habilitation,
  },
  {
    label: "Centre de formation",
    theme: "formation" as const,
    subtitle: "Environnement premium",
    image: TRAINING_IMAGES.formation,
    featured: true,
  },
] as const;

export const WHY_CHOOSE_US = {
  quote: {
    text: "Notre mission : former des professionnels capables d'agir avec rigueur, sang-froid et conformité réglementaire.",
    author: "LT Protect Formation",
    role: "Centre certifié Qualiopi & Qualianor",
  },
  pillars: [
    {
      title: "Expertise terrain",
      description:
        "Formateurs issus du monde opérationnel — incendie, secours, sûreté et habilitations électriques.",
      metric: "178",
      metricLabel: "participants formés en 2025",
    },
    {
      title: "Conformité réglementaire",
      description:
        "Programmes alignés sur les référentiels en vigueur : SSIAP, SST, APS, NF C 18-510 et EPI.",
      metric: "98,26\u00A0%",
      metricLabel: "taux de réussite aux examens",
    },
    {
      title: "Accompagnement humain",
      description:
        "Suivi individualisé, pédagogie pratique et 0 abandon en 2025 — parce que chaque stagiaire compte.",
      metric: "4,95/5",
      metricLabel: "note moyenne des participants",
    },
  ],
  badges: ["Qualiopi", "Qualianor", "Éligible CPF", "Formateurs certifiés"],
} as const;

export const CERTIFICATIONS = [
  {
    id: "qualiopi",
    name: "Qualiopi",
    shortName: "Certification Qualiopi",
    description:
      "Certification qualité des actions de formation — garantie de processus et de résultats conformes aux exigences nationales.",
    image: "/certifications/qualiopi.jpg",
    points: ["Audit qualité régulier", "Processus certifié"],
  },
  {
    id: "qualianor",
    name: "Qualianor",
    shortName: "Certification Qualianor",
    description:
      "Reconnaissance des compétences professionnelles — engagement qualité et traçabilité des parcours de formation.",
    image: "/certifications/qualianor.jpg",
    points: ["Traçabilité des compétences", "Reconnaissance officielle"],
  },
  {
    id: "cpf",
    name: "Mon Compte Formation",
    shortName: "Éligible CPF",
    description:
      "Nos formations sont éligibles au financement via votre Compte Personnel de Formation (CPF).",
    image: "/certifications/cpf.png",
    points: ["Financement CPF", "Parcours finançables"],
  },
] as const;

export const STATS_2025 = [
  {
    value: "178",
    label: "Participants formés en 2025",
    animate: { type: "int" as const, end: 178 },
  },
  {
    value: "98,26\u00A0%",
    label: "Taux de réussite aux examens",
    animate: { type: "decimal" as const, end: 98.26, suffix: "\u00A0%" },
  },
  {
    value: "98,99\u00A0%",
    label: "Taux de satisfaction des participants",
    animate: { type: "decimal" as const, end: 98.99, suffix: "\u00A0%" },
  },
  {
    value: "0",
    label: "Abandon durant les formations en 2025",
    animate: { type: "int" as const, end: 0 },
  },
  {
    value: "4,95/5",
    label: "Note moyenne des avis participants",
    animate: { type: "rating" as const, end: 4.95 },
  },
] as const;

export const FOOTER_FORMATIONS = [
  { label: "Sécurité incendie", href: "/formations" },
  { label: "Secourisme", href: "/formations" },
  { label: "Sûreté", href: "/formations" },
  { label: "Habilitation électrique", href: "/formations" },
] as const;

export const TRAINING_CATEGORIES = [
  {
    id: "ssiap",
    title: "SSIAP",
    subtitle: "Sécurité incendie",
    badge: "Certifiant",
    visual: "incendie" as const,
    image: TRAINING_IMAGES.incendie,
    layout: "split" as const,
    description:
      "Service de sécurité incendie et d'assistance à personnes — tous niveaux, conformes aux exigences réglementaires.",
    highlights: ["SSIAP 1, 2 et 3", "Recyclages & remises à niveau", "Formateurs experts terrain"],
  },
  {
    id: "sst",
    title: "SST",
    subtitle: "Secourisme",
    badge: "Obligatoire",
    visual: "secourisme" as const,
    image: TRAINING_IMAGES.secourisme,
    layout: "standard" as const,
    description:
      "Sauveteur secouriste du travail — prévention des risques et gestes de premiers secours en entreprise.",
    highlights: ["Initiation & recyclage", "Conformité Code du travail", "Pédagogie pratique"],
  },
  {
    id: "aps",
    title: "APS",
    subtitle: "Sûreté",
    badge: "Certifiant",
    visual: "surete" as const,
    image: TRAINING_IMAGES.surete,
    layout: "immersion" as const,
    description:
      "Agent de prévention et de sécurité — surveillance, accueil, gestion des flux et prévention des risques.",
    highlights: ["Initiation complète", "Mises en situation", "Certification professionnelle"],
  },
  {
    id: "habilitation",
    title: "Habilitation électrique",
    subtitle: "Électricité",
    badge: "Reconnu",
    visual: "habilitation" as const,
    image: TRAINING_IMAGES.habilitation,
    layout: "standard" as const,
    description:
      "Travaux sous tension, consignation et habilitations — conformité NF C 18-510 pour tous profils.",
    highlights: ["B0, H0, B1, H1…", "Non-électriciens & électriciens", "Recyclages périodiques"],
  },
  {
    id: "epi",
    title: "EPI",
    subtitle: "Intervention",
    badge: "Certifiant",
    visual: "professionals" as const,
    image: TRAINING_IMAGES.intervention,
    layout: "editorial" as const,
    description:
      "Équipier de première intervention — réaction rapide et structurée face aux situations d'urgence.",
    highlights: ["Équipes d'intervention", "Exercices pratiques", "Procédures d'urgence"],
  },
] as const;

export const LEGAL_LINKS = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "CGV", href: "/cgv" },
  { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
] as const;

export const PRIVACY_POLICY_PATH = "/politique-de-confidentialite";

export const SOCIAL_LINKS = [
  { label: "Facebook", href: "#", icon: "facebook" as const },
  { label: "LinkedIn", href: "#", icon: "linkedin" as const },
] as const;
