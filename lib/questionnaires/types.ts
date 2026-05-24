export type QuestionnaireTarget = "post-formation" | "satisfaction" | "evaluation";

export interface QuestionnaireDefinition {
  id: string;
  title: string;
  description: string;
  target: QuestionnaireTarget;
  /** Reserved for future admin activation. */
  active: boolean;
}

/** Placeholder registry — future admin-managed questionnaires. */
export const QUESTIONNAIRE_DEFINITIONS: QuestionnaireDefinition[] = [];
