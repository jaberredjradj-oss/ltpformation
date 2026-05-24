import type { RegistrationFormValues, RegistrationIntent } from "@/lib/registration/types";

export interface RegistrationValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  employeeCount?: string;
  formationSlug?: string;
  sessionId?: string;
  participantCount?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegistrationForm(
  values: RegistrationFormValues,
  intent: RegistrationIntent,
): RegistrationValidationErrors {
  const errors: RegistrationValidationErrors = {};
  const isDevis = intent === "devis";

  if (!values.firstName.trim()) {
    errors.firstName = "Le prénom est requis.";
  }

  if (!values.lastName.trim()) {
    errors.lastName = "Le nom est requis.";
  }

  if (!values.email.trim()) {
    errors.email = "L'email est requis.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Adresse email invalide.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Le téléphone est requis.";
  }

  if (isDevis && !values.company.trim()) {
    errors.company = "Le nom de l'entreprise est requis.";
  }

  if (isDevis && values.employeeCount.trim()) {
    const employeeCount = Number(values.employeeCount);
    if (!Number.isFinite(employeeCount) || employeeCount < 1) {
      errors.employeeCount = "Indiquez un effectif valide.";
    }
  }

  if (!values.formationSlug) {
    errors.formationSlug = "Veuillez sélectionner une formation.";
  }

  if (!isDevis && !values.sessionId) {
    errors.sessionId = "Veuillez sélectionner une session.";
  }

  if (isDevis) {
    if (!Number.isFinite(values.participantCount) || values.participantCount < 1) {
      errors.participantCount = "Indiquez au moins 1 participant.";
    }
  }

  return errors;
}

export function hasValidationErrors(errors: RegistrationValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
