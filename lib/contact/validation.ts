import type { ContactFormValues } from "@/lib/contact/types";

export interface ContactValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(values: ContactFormValues): ContactValidationErrors {
  const errors: ContactValidationErrors = {};

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

  if (!values.message.trim()) {
    errors.message = "Votre message est requis.";
  }

  return errors;
}

export function hasContactValidationErrors(errors: ContactValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
