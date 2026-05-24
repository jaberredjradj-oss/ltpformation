export type RegistrationIntent = "devis" | "preinscription";

export type CpfFinancingChoice = "yes" | "no" | "unknown";

export type OnSiteTrainingChoice = "yes" | "no" | "unknown";

export interface RegistrationFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  employeeCount: string;
  formationSlug: string;
  sessionId: string;
  cpfFinancing: CpfFinancingChoice | "";
  participantCount: number;
  onSiteTraining: OnSiteTrainingChoice | "";
  message: string;
}

export interface RegistrationContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
}

export interface RegistrationSessionSnapshot {
  id: string;
  title: string;
  dateRange: string;
  examLabel: string | null;
  availabilityLabel: string;
  location: string;
}

export interface RegistrationSubmission {
  id: string;
  intent: RegistrationIntent;
  sessionId: string | null;
  formationSlug: string;
  participantCount: number;
  employeeCount: number | null;
  onSiteTraining: OnSiteTrainingChoice | null;
  cpfFinancing: CpfFinancingChoice | null;
  contact: RegistrationContact;
  message?: string;
  submittedAt: string;
  sessionSnapshot: RegistrationSessionSnapshot | null;
}

export const DEFAULT_REGISTRATION_FORM_VALUES: RegistrationFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  employeeCount: "",
  formationSlug: "",
  sessionId: "",
  cpfFinancing: "",
  participantCount: 1,
  onSiteTraining: "",
  message: "",
};

export const REGISTRATION_INTENT_COPY: Record<
  RegistrationIntent,
  {
    title: string;
    eyebrow: string;
    submitLabel: string;
    successTitle: string;
    contactEyebrow: string;
    projectEyebrow: string;
  }
> = {
  devis: {
    eyebrow: "Demande personnalisée",
    title: "Demander un devis",
    submitLabel: "Envoyer ma demande de devis",
    successTitle: "Demande de devis enregistrée",
    contactEyebrow: "Votre entreprise",
    projectEyebrow: "Votre projet de formation",
  },
  preinscription: {
    eyebrow: "Réservation de place",
    title: "Pré-inscription",
    submitLabel: "Confirmer ma pré-inscription",
    successTitle: "Pré-inscription enregistrée",
    contactEyebrow: "Vos coordonnées",
    projectEyebrow: "Formation & session",
  },
};
