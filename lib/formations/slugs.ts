export const FORMATION_SLUGS = [
  "ssiap-1-initial",
  "ssiap-1-recyclage",
  "ssiap-1-remise-a-niveau",
  "ssiap-2-initial",
  "ssiap-2-recyclage",
  "ssiap-2-remise-a-niveau",
  "ssiap-3-initial",
  "ssiap-3-recyclage",
  "ssiap-3-remise-a-niveau",
  "epi",
  "ssi",
  "sst-initial",
  "mac-sst",
  "tfp-aps",
  "mac-aps",
  "h0b0-h0v",
  "bsbe",
] as const;

export type FormationSlug = (typeof FORMATION_SLUGS)[number];

export function isFormationSlug(value: string): value is FormationSlug {
  return (FORMATION_SLUGS as readonly string[]).includes(value);
}
