export const INSTALLMENT_LABEL = "3 fois sans frais";

export const INSTALLMENT_BADGE_SRC = "/images/payment/3x-sans-frais.png";
export const INSTALLMENT_BADGE_WIDTH = 504;
export const INSTALLMENT_BADGE_HEIGHT = 73;

// Formations that can be paid in three interest-free installments.
const INSTALLMENT_SLUGS = new Set<string>([
  "ssiap-1-initial",
  "ssiap-2-initial",
  "ssiap-3-initial",
  "tfp-aps",
]);

export function hasInstallmentFacility(slug: string | null | undefined): boolean {
  return slug ? INSTALLMENT_SLUGS.has(slug) : false;
}
