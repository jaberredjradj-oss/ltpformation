import type { FormationCategoryId } from "@/lib/formations/types";
import type { PlanningSession, PlanningSessionStatus } from "@/lib/planning/types";

const DEFAULT_LOCATION =
  "Voisins-le-Bretonneux — Bâtiment A, 1er étage · LT Protect Formation";
const DEFAULT_SCHEDULE = "9h00 - 17h00";

interface SessionSeed {
  id: string;
  formationSlug: string | null;
  formationTitle: string;
  sessionType: string;
  category: FormationCategoryId;
  categoryLabel: string;
  startDate: string;
  endDate: string;
  examDate?: string | null;
  cpfEligible?: boolean;
  certificationCode?: string | null;
  notes?: string[];
  status?: PlanningSessionStatus;
  seatsTotal?: number | null;
  seatsTaken?: number | null;
  visible?: boolean;
}

function createSession(seed: SessionSeed): PlanningSession {
  const year = Number(seed.startDate.slice(0, 4));

  return {
    id: seed.id,
    formationSlug: seed.formationSlug,
    formationTitle: seed.formationTitle,
    sessionType: seed.sessionType,
    category: seed.category,
    categoryLabel: seed.categoryLabel,
    startDate: seed.startDate,
    endDate: seed.endDate,
    examDate: seed.examDate ?? null,
    scheduleLabel: DEFAULT_SCHEDULE,
    location: DEFAULT_LOCATION,
    notes: seed.notes ?? [],
    cpfEligible: seed.cpfEligible ?? false,
    certificationCode: seed.certificationCode ?? null,
    status: seed.status ?? "open",
    seatsTotal: seed.seatsTotal ?? null,
    seatsTaken: seed.seatsTaken ?? null,
    visible: seed.visible ?? true,
    year,
  };
}

const SSIAP1_INITIAL = {
  formationSlug: "ssiap-1-initial",
  formationTitle: "SSIAP 1 — Formation initiale agent de sécurité incendie",
  sessionType: "Initial",
  category: "securite-incendie" as const,
  categoryLabel: "Sécurité incendie",
  cpfEligible: true,
  certificationCode: "RS5641",
};

const SSIAP1_RECYCLAGE = {
  formationSlug: "ssiap-1-recyclage",
  formationTitle: "SSIAP 1 — Recyclage",
  sessionType: "Recyclage",
  category: "securite-incendie" as const,
  categoryLabel: "Sécurité incendie",
  cpfEligible: true,
  certificationCode: "RS5641",
};

const SSIAP1_REMISE = {
  formationSlug: "ssiap-1-remise-a-niveau",
  formationTitle: "SSIAP 1 — Remise à niveau",
  sessionType: "Remise à niveau",
  category: "securite-incendie" as const,
  categoryLabel: "Sécurité incendie",
  cpfEligible: true,
  certificationCode: "RS5641",
};

const SSIAP2_INITIAL = {
  formationSlug: "ssiap-2-initial",
  formationTitle: "SSIAP 2 — Formation initiale chef d'équipe",
  sessionType: "Initial",
  category: "securite-incendie" as const,
  categoryLabel: "Sécurité incendie",
  cpfEligible: true,
  certificationCode: "RS5642",
};

const SSIAP2_RECYCLAGE = {
  formationSlug: "ssiap-2-recyclage",
  formationTitle: "SSIAP 2 — Recyclage chef d'équipe",
  sessionType: "Recyclage",
  category: "securite-incendie" as const,
  categoryLabel: "Sécurité incendie",
  cpfEligible: true,
  certificationCode: "RS5642",
};

const SSIAP2_REMISE = {
  formationSlug: "ssiap-2-remise-a-niveau",
  formationTitle: "SSIAP 2 — Remise à niveau chef d'équipe",
  sessionType: "Remise à niveau",
  category: "securite-incendie" as const,
  categoryLabel: "Sécurité incendie",
  cpfEligible: true,
  certificationCode: "RS5642",
};

const TFP_APS = {
  formationSlug: "tfp-aps",
  formationTitle: "TFP APS — Agent de prévention et de sécurité",
  sessionType: "Initial",
  category: "surete" as const,
  categoryLabel: "Sûreté",
  cpfEligible: true,
  certificationCode: "RNCP37035",
};

const MAC_APS = {
  formationSlug: "mac-aps",
  formationTitle: "MAC APS — Maintien et actualisation des compétences",
  sessionType: "MAC",
  category: "surete" as const,
  categoryLabel: "Sûreté",
  cpfEligible: false,
  certificationCode: null,
};

const PSGE_MODULE = {
  formationSlug: "tfp-aps",
  formationTitle: "Module PSGE vers TFP APS",
  sessionType: "Module de transition",
  category: "surete" as const,
  categoryLabel: "Sûreté",
  cpfEligible: false,
  certificationCode: null,
  notes: ["Parcours de transition PSGE vers TFP APS"],
};

export const PLANNING_SESSIONS: PlanningSession[] = [
  createSession({ id: "ssiap1-init-2026-01", ...SSIAP1_INITIAL, startDate: "2026-01-12", endDate: "2026-01-26", examDate: "2026-01-27", seatsTotal: 12, seatsTaken: 4 }),
  createSession({ id: "ssiap1-init-2026-02", ...SSIAP1_INITIAL, startDate: "2026-02-10", endDate: "2026-02-24", examDate: "2026-02-25", seatsTotal: 12, seatsTaken: 10 }),
  createSession({ id: "ssiap1-init-2026-03", ...SSIAP1_INITIAL, startDate: "2026-03-16", endDate: "2026-03-30", examDate: "2026-03-31" }),
  createSession({ id: "ssiap1-init-2026-04", ...SSIAP1_INITIAL, startDate: "2026-04-13", endDate: "2026-04-27", examDate: "2026-04-28" }),
  createSession({ id: "ssiap1-init-2026-05", ...SSIAP1_INITIAL, startDate: "2026-05-07", endDate: "2026-05-26", examDate: "2026-05-27" }),
  createSession({ id: "ssiap1-init-2026-06", ...SSIAP1_INITIAL, startDate: "2026-06-15", endDate: "2026-06-29", examDate: "2026-06-30" }),

  createSession({ id: "ssiap1-rec-2026-01", ...SSIAP1_RECYCLAGE, startDate: "2026-01-22", endDate: "2026-01-23" }),
  createSession({ id: "ssiap1-rec-2026-02", ...SSIAP1_RECYCLAGE, startDate: "2026-02-19", endDate: "2026-02-20" }),
  createSession({ id: "ssiap1-rec-2026-03", ...SSIAP1_RECYCLAGE, startDate: "2026-03-26", endDate: "2026-03-27", seatsTotal: 8, seatsTaken: 2 }),
  createSession({ id: "ssiap1-rec-2026-04", ...SSIAP1_RECYCLAGE, startDate: "2026-04-23", endDate: "2026-04-24" }),
  createSession({ id: "ssiap1-rec-2026-05", ...SSIAP1_RECYCLAGE, startDate: "2026-05-21", endDate: "2026-05-22" }),
  createSession({ id: "ssiap1-rec-2026-06", ...SSIAP1_RECYCLAGE, startDate: "2026-06-25", endDate: "2026-06-26" }),

  createSession({ id: "ssiap1-ran-2026-01", ...SSIAP1_REMISE, startDate: "2026-01-21", endDate: "2026-01-23" }),
  createSession({ id: "ssiap1-ran-2026-02", ...SSIAP1_REMISE, startDate: "2026-02-18", endDate: "2026-02-20" }),
  createSession({ id: "ssiap1-ran-2026-03", ...SSIAP1_REMISE, startDate: "2026-03-25", endDate: "2026-03-27" }),
  createSession({ id: "ssiap1-ran-2026-04", ...SSIAP1_REMISE, startDate: "2026-04-22", endDate: "2026-04-24" }),
  createSession({ id: "ssiap1-ran-2026-05", ...SSIAP1_REMISE, startDate: "2026-05-20", endDate: "2026-05-22" }),
  createSession({ id: "ssiap1-ran-2026-06", ...SSIAP1_REMISE, startDate: "2026-06-24", endDate: "2026-06-26" }),

  createSession({ id: "tfp-aps-2026-01", ...TFP_APS, startDate: "2026-01-26", endDate: "2026-02-26", examDate: "2026-02-27", seatsTotal: 15, seatsTaken: 13 }),
  createSession({ id: "tfp-aps-2026-02", ...TFP_APS, startDate: "2026-03-02", endDate: "2026-04-02", examDate: "2026-04-03" }),
  createSession({ id: "tfp-aps-2026-03", ...TFP_APS, startDate: "2026-05-04", endDate: "2026-06-11", examDate: "2026-06-12" }),

  createSession({ id: "mac-aps-2026-01", ...MAC_APS, startDate: "2026-01-06", endDate: "2026-01-09" }),
  createSession({ id: "mac-aps-2026-02", ...MAC_APS, startDate: "2026-02-03", endDate: "2026-02-06" }),
  createSession({ id: "mac-aps-2026-03", ...MAC_APS, startDate: "2026-03-09", endDate: "2026-03-12", seatsTotal: 12, seatsTaken: 12 }),
  createSession({ id: "mac-aps-2026-04", ...MAC_APS, startDate: "2026-04-13", endDate: "2026-04-16" }),
  createSession({ id: "mac-aps-2026-05", ...MAC_APS, startDate: "2026-05-19", endDate: "2026-05-22" }),
  createSession({ id: "mac-aps-2026-06", ...MAC_APS, startDate: "2026-06-22", endDate: "2026-06-25" }),

  createSession({ id: "ssiap2-init-2026-01", ...SSIAP2_INITIAL, startDate: "2026-02-02", endDate: "2026-02-13", examDate: "2026-02-15", seatsTotal: 10, seatsTaken: 9 }),
  createSession({ id: "ssiap2-init-2026-02", ...SSIAP2_INITIAL, startDate: "2026-04-01", endDate: "2026-04-14", examDate: "2026-04-15" }),
  createSession({ id: "ssiap2-init-2026-03", ...SSIAP2_INITIAL, startDate: "2026-06-01", endDate: "2026-06-12", examDate: "2026-06-15" }),

  createSession({ id: "ssiap2-rec-2026-01", ...SSIAP2_RECYCLAGE, startDate: "2026-02-05", endDate: "2026-02-06" }),
  createSession({ id: "ssiap2-rec-2026-02", ...SSIAP2_RECYCLAGE, startDate: "2026-04-09", endDate: "2026-04-10" }),
  createSession({ id: "ssiap2-rec-2026-03", ...SSIAP2_RECYCLAGE, startDate: "2026-06-04", endDate: "2026-06-05" }),

  createSession({ id: "ssiap2-ran-2026-01", ...SSIAP2_REMISE, startDate: "2026-02-04", endDate: "2026-02-06" }),
  createSession({ id: "ssiap2-ran-2026-02", ...SSIAP2_REMISE, startDate: "2026-04-08", endDate: "2026-04-10" }),
  createSession({ id: "ssiap2-ran-2026-03", ...SSIAP2_REMISE, startDate: "2026-06-03", endDate: "2026-06-05" }),

  createSession({ id: "psge-tfp-2026-01", ...PSGE_MODULE, startDate: "2026-02-11", endDate: "2026-02-26", examDate: "2026-02-27" }),
  createSession({ id: "psge-tfp-2026-02", ...PSGE_MODULE, startDate: "2026-03-19", endDate: "2026-04-02", examDate: "2026-04-03" }),
  createSession({ id: "psge-tfp-2026-03", ...PSGE_MODULE, startDate: "2026-05-26", endDate: "2026-06-11", examDate: "2026-06-12" }),
];
