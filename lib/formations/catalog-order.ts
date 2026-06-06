import type { Formation } from "@/lib/formations/types";

/**
 * Canonical catalogue order (legacy website).
 * EPI near the end of incendie block; SSI last within incendie.
 */
export const FORMATION_CATALOG_SLUG_ORDER = [
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
  "gestes-et-postures",
  "risque-chimique",
  "dirigeant-securite-privee",
] as const;

const CATALOG_ORDER_INDEX = Object.fromEntries(
  FORMATION_CATALOG_SLUG_ORDER.map((slug, index) => [slug, index]),
) as Record<string, number>;

export function getFormationCatalogSortIndex(formation: Pick<Formation, "slug">): number {
  return CATALOG_ORDER_INDEX[formation.slug] ?? 9999;
}
