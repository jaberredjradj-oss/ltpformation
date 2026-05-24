export type {
  CpfFinancingChoice,
  RegistrationContact,
  RegistrationFormValues,
  RegistrationIntent,
  RegistrationSessionSnapshot,
  RegistrationSubmission,
} from "@/lib/registration/types";
export {
  DEFAULT_REGISTRATION_FORM_VALUES,
  REGISTRATION_INTENT_COPY,
} from "@/lib/registration/types";
export {
  buildSessionSnapshot,
  getUpcomingSessionsForFormation,
  resolveRegistrationContext,
} from "@/lib/registration/resolve-context";
export type { RegistrationContext } from "@/lib/registration/resolve-context";
export {
  hasValidationErrors,
  validateRegistrationForm,
} from "@/lib/registration/validation";
export type { RegistrationValidationErrors } from "@/lib/registration/validation";
export { submitRegistration } from "@/lib/registration/actions";
export type {
  RegistrationSubmitPayload,
  RegistrationSubmitResult,
} from "@/lib/registration/actions";
