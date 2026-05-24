export {
  getEmailFrom,
  getEmailProvider,
  getEmailReplyTo,
  isEmailEnabled,
  type EmailProvider,
} from "@/lib/email/env";
export { EMAIL_BRAND, getEmailLogoUrl } from "@/lib/email/brand";
export { buildBrandedEmail } from "@/lib/email/layout";
export type { BrandedEmailOptions, BrandedEmailOutput } from "@/lib/email/layout";
export { sendBrandedAdminEmail } from "@/lib/email/send-branded-admin-email";
export {
  buildContactReplyContent,
  buildDecisionEmailContent,
  extractFirstName,
} from "@/lib/email/templates";
export type {
  DecisionEmailContent,
  DecisionEmailKind,
  SendBrandedAdminEmailInput,
  SendBrandedAdminEmailResult,
} from "@/lib/email/types";
