import type { CallbackFormValues } from "@/lib/callback/types";

export interface CallbackValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCallbackForm(values: CallbackFormValues): CallbackValidationErrors {
  const errors: CallbackValidationErrors = {};

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
    errors.phone = "Le numéro de téléphone est requis.";
  }

  return errors;
}

export function hasCallbackValidationErrors(errors: CallbackValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
