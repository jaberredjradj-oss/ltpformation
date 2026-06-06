import { formation as ssiap_1_initial } from "./ssiap-1-initial";
import { formation as ssiap_1_recyclage } from "./ssiap-1-recyclage";
import { formation as ssiap_1_remise_a_niveau } from "./ssiap-1-remise-a-niveau";
import { formation as ssiap_2_initial } from "./ssiap-2-initial";
import { formation as ssiap_2_recyclage } from "./ssiap-2-recyclage";
import { formation as ssiap_2_remise_a_niveau } from "./ssiap-2-remise-a-niveau";
import { formation as ssiap_3_initial } from "./ssiap-3-initial";
import { formation as ssiap_3_recyclage } from "./ssiap-3-recyclage";
import { formation as ssiap_3_remise_a_niveau } from "./ssiap-3-remise-a-niveau";
import { formation as epi } from "./epi";
import { formation as ssi } from "./ssi";
import { formation as sst_initial } from "./sst-initial";
import { formation as mac_sst } from "./mac-sst";
import { formation as tfp_aps } from "./tfp-aps";
import { formation as mac_aps } from "./mac-aps";
import { formation as h0b0_h0v } from "./h0b0-h0v";
import { formation as bsbe } from "./bsbe";
import { formation as dirigeant_securite_privee } from "./dirigeant-securite-privee";
import { formation as gestes_et_postures } from "./gestes-et-postures";
import { formation as risque_chimique } from "./risque-chimique";

import type { Formation } from "@/lib/formations/types";

export const FORMATION_DATA: Formation[] = [
  ssiap_1_initial,
  ssiap_1_recyclage,
  ssiap_1_remise_a_niveau,
  ssiap_2_initial,
  ssiap_2_recyclage,
  ssiap_2_remise_a_niveau,
  ssiap_3_initial,
  ssiap_3_recyclage,
  ssiap_3_remise_a_niveau,
  epi,
  ssi,
  sst_initial,
  mac_sst,
  tfp_aps,
  mac_aps,
  h0b0_h0v,
  bsbe,
  gestes_et_postures,
  risque_chimique,
  dirigeant_securite_privee,
];
