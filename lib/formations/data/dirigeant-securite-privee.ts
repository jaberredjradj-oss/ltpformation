import type { Formation } from "@/lib/formations/types";

export const formation: Formation = {
  slug: "dirigeant-securite-privee",
  title: "Dirigeant d'entreprise de sécurité privée",
  shortTitle: "Dirigeant sécurité privée",
  category: "surete",
  categoryLabel: "Sûreté",
  type: "certification",
  typeLabel: "Certification",
  level: null,
  durationHours: 255,
  durationLabel: "255 heures (7 modules)",
  price: {
    amount: 5000,
    currency: "EUR",
    label: "5 000,00 € TTC pour le parcours complet",
    shortLabel: "5 000 €",
  },
  cpfEligible: true,
  cpfNote: "Certification RNCP41991 éligible au CPF.",
  certificationCode: "RNCP41991",
  certifications: ["Qualiopi", "RNCP"],
  summary:
    "Formation certifiante de niveau 5 préparant au Titre « Dirigeant d'entreprise de sécurité privée » (RNCP41991), éligible CPF, pour créer, reprendre et piloter une entreprise de sécurité privée en conformité avec le Livre VI du Code de la sécurité intérieure.",
  imageKey: "surete",
  pdfFilename: "dirigeant-securite-privee.pdf",
  pdfUrl: "/pdfs/formations/dirigeant-securite-privee.pdf",
  pdfAvailable: true,
  contentStatus: "published",
  publicConcerned: [
    "Futurs créateurs ou repreneurs d'entreprise de sécurité privée",
    "Dirigeants, gérants et associés de société de sécurité",
    "Cadres et responsables du secteur souhaitant accéder à la fonction de dirigeant et à l'agrémement CNAPS",
    "Toute personne visant la direction d'une structure de sécurité privée dans le respect du cadre réglementaire",
  ],
  prerequisites: [
    "Être titulaire d'un titre ou diplôme de niveau 4 (baccalauréat) au minimum",
    "Présenter un casier judiciaire (bulletin n° 3) vierge",
    "Maîtrise du français à l'oral et à l'écrit",
    "Être de nationalité française, ressortissant d'un État membre de l'Union européenne, ou d'un État ayant conclu une convention bilatérale avec la France",
  ],
  presentation:
    "Diriger une entreprise de sécurité privée ne s'improvise pas : c'est une activité strictement encadrée par le Livre VI du Code de la sécurité intérieure. Tout exploitant, dirigeant ou gérant doit justifier d'une aptitude professionnelle et être titulaire d'un agrément délivré par le CNAPS. Cette formation apporte l'ensemble des connaissances et compétences nécessaires pour créer, reprendre et piloter une telle entreprise en toute conformité. Structurée autour de quatre domaines de compétences (juridique et droit du travail, gestion opérationnelle et RH, gestion commerciale et communication, gestion administrative et financière), elle couvre la réglementation du secteur et la gestion concrète d'une entreprise.",
  objectives: [
    "Maîtriser l'environnement juridique de la sécurité privée et le droit du travail",
    "Assurer la gestion opérationnelle et des ressources humaines",
    "Assurer la gestion commerciale et la communication",
    "Assurer la gestion administrative, financière et comptable",
    "Répondre à un appel d'offres public ou privé et développer la notoriété de l'entreprise",
  ],
  programme: {
    totalHours: 255,
    modules: [
      {
        title: "Notions juridiques : droit du travail",
        hours: 40,
        content: [],
      },
      {
        title: "Environnement juridique de la sécurité privée",
        hours: 44,
        content: [],
      },
      {
        title: "Positionnement de la sécurité privée",
        hours: 40,
        content: [],
      },
      {
        title: "Prévention des risques terroristes",
        hours: 11,
        content: [],
      },
      {
        title: "Équipements et techniques de la sécurité privée",
        hours: 20,
        content: [],
      },
      {
        title: "Management de l'entreprise et des moyens",
        hours: 60,
        content: [],
      },
      {
        title: "Capacité à répondre à un appel d'offres",
        hours: 40,
        content: [],
      },
    ],
  },
  registration: [
    "Demande de devis. Prise de contact et vérification des prérequis (niveau, moralité, nationalité).",
    "Validation de l'inscription confirmée à réception du devis signé et, le cas échéant, de l'accord de financement (CPF, OPCO, France Travail).",
    "Convention de formation établie conformément aux exigences légales (objet, durée, contenu, modalités, coût).",
    "Convocation adressée au candidat avant le démarrage de la formation.",
    "Parcours mixte alternant formation à distance (e-learning) et travaux pratiques, en inter ou intra-entreprise.",
    "LT PROTECT FORMATION M. BALLO Téléphone : 06.40.41.62.10 Lieu de formation : Voisins-Le-Bretonneux (78)",
  ],
  evaluation: [
    "Contrôle continu (e-learning) : chaque module se conclut par un QCM ; un minimum de 60 % de bonnes réponses conditionne l'accès à l'examen final.",
    "Travaux pratiques : plaquette commerciale, modèle de facture et de devis conformes, business plan.",
    "Examen final : épreuve écrite (QCM/QROC, 1 heure, 40 questions) et entretien individuel devant un jury de professionnels. Validation à partir d'une note de 12/20.",
  ],
  pedagogicalTeam: [
    "Formateurs experts du secteur de la sécurité privée et de la gestion d'entreprise.",
    "Connaissance approfondie du cadre réglementaire (Livre VI du CSI, CNAPS).",
    "Compétences pédagogiques reconnues.",
  ],
  pedagogicalMeans: [
    "Plateforme e-learning et supports numériques",
    "Travaux pratiques et études de cas reconstituées (recrutement, gestion de conflit, devis, appel d'offres)",
    "Documentation remise au candidat",
    "Mises en situation professionnelle",
  ],
  followUp: [
    "Suivi des connexions et de la progression sur la plateforme e-learning",
    "Feuilles d'émargement et suivi de présence",
    "Évaluations en contrôle continu et examen final",
    "Jury composé d'au minimum 3 professionnels du secteur, dont le président",
    "Questionnaire de satisfaction remis aux participants",
    "Délivrance du Titre RNCP41991 aux candidats déclarés aptes",
  ],
  careerOutcomes: [
    "Dirigeant ou gérant de société de sécurité privée",
    "Directeur général ou directeur opérationnel d'entreprise de sécurité privée",
    "Responsable d'agence ou adjoint de direction",
    "Associé ou mandataire social d'une entreprise de sécurité privée",
    "Responsable de la sécurité d'un site événementiel",
    "Codes ROME associés : K2503, K2502, M1302",
  ],
  accessibility:
    "Nos locaux sont accessibles aux personnes à mobilité réduite. Pour toute situation de handicap, merci de nous contacter afin d'étudier les adaptations possibles (aménagement du parcours, des supports pédagogiques, de la durée, etc.). Référent PSH M. BALLO : 06.40.41.62.10",
};
