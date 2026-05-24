export type DecisionEmailKind =
  | "preinscription.accepted"
  | "preinscription.refused"
  | "devis.followup";

export type DecisionEmailEntityType = "preinscription" | "devis";

export interface DecisionEmailTemplateInput {
  firstName: string;
  formationTitle: string;
}

export interface DecisionEmailContent {
  kind: DecisionEmailKind;
  subject: string;
  message: string;
}

export interface SendBrandedAdminEmailInput {
  to: string;
  subject: string;
  message: string;
}

export type SendBrandedAdminEmailResult =
  | { ok: true; skipped: boolean }
  | { ok: false; error: string };

/** @deprecated Use SendBrandedAdminEmailInput */
export type SendDecisionEmailInput = SendBrandedAdminEmailInput;

/** @deprecated Use SendBrandedAdminEmailResult */
export type SendDecisionEmailResult = SendBrandedAdminEmailResult;
