import type { Formation } from "@/lib/formations/types";
import { THEME_IMAGES } from "@/lib/training-images";

const FORMATIONS_DIR = "/images/training/formations";

export const FORMATION_COVER_IMAGES: Record<string, string> = {
  "ssiap-1-initial": `${FORMATIONS_DIR}/ssiap-1-initial-v2.jpg`,
  "ssiap-1-recyclage": `${FORMATIONS_DIR}/ssiap-1-recyclage-v2.jpg`,
  "ssiap-1-remise-a-niveau": `${FORMATIONS_DIR}/ssiap-1-remise-a-niveau-v2.jpg`,
  "ssiap-2-initial": `${FORMATIONS_DIR}/ssiap-2-initial-v2.jpg`,
  "ssiap-2-recyclage": `${FORMATIONS_DIR}/ssiap-2-recyclage-v2.jpg`,
  "ssiap-2-remise-a-niveau": `${FORMATIONS_DIR}/ssiap-2-remise-a-niveau-v2.jpg`,
  "ssiap-3-initial": `${FORMATIONS_DIR}/ssiap-3-initial-v2.jpg`,
  "ssiap-3-recyclage": `${FORMATIONS_DIR}/ssiap-3-recyclage-v2.jpg`,
  "ssiap-3-remise-a-niveau": `${FORMATIONS_DIR}/ssiap-3-remise-a-niveau-v2.jpg`,
  epi: `${FORMATIONS_DIR}/epi-v2.jpg`,
  ssi: `${FORMATIONS_DIR}/ssi-v2.jpg`,
  "sst-initial": `${FORMATIONS_DIR}/sst-initial-v2.jpg`,
  "mac-sst": `${FORMATIONS_DIR}/mac-sst-v2.jpg`,
  "tfp-aps": `${FORMATIONS_DIR}/tfp-aps-v2.jpg`,
  "mac-aps": `${FORMATIONS_DIR}/mac-aps-v2.jpg`,
  "h0b0-h0v": `${FORMATIONS_DIR}/h0b0-h0v-v2.jpg`,
  bsbe: `${FORMATIONS_DIR}/bsbe-v2.jpg`,
  "gestes-et-postures": `${FORMATIONS_DIR}/gestes-et-postures-v2.jpg`,
  "risque-chimique": `${FORMATIONS_DIR}/risque-chimique-v2.jpg`,
  "dirigeant-securite-privee": `${FORMATIONS_DIR}/dirigeant-securite-privee-v2.jpg`,
};

export function getFormationCoverImage(
  formation: Pick<Formation, "slug" | "imageKey" | "coverImageUrl">,
): string {
  // Priority: admin custom cover → per-slug static banner → category theme.
  return (
    formation.coverImageUrl ||
    FORMATION_COVER_IMAGES[formation.slug] ||
    THEME_IMAGES[formation.imageKey]
  );
}
