export type CallbackFormSource = "rappel" | "contact" | "formation";

export interface CallbackFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
}

export const DEFAULT_CALLBACK_FORM_VALUES: CallbackFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
};
