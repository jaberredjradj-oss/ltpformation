import type { CategoryVisualTheme } from "@/lib/category-visuals";

export type FormationCategoryId =
  | "securite-incendie"
  | "secourisme"
  | "surete"
  | "habilitation-electrique";

export type FormationType =
  | "initial"
  | "recyclage"
  | "remise-a-niveau"
  | "mac"
  | "certification";

export type FormationLevel = "1" | "2" | "3" | null;

export type FormationContentStatus = "stub" | "published";

export interface FormationModule {
  title: string;
  hours?: number;
  content: string[];
}

export interface FormationProgramme {
  totalHours?: number;
  modules: FormationModule[];
}

export interface FormationPrice {
  amount: number;
  currency: "EUR";
  label: string;
  shortLabel?: string;
  note?: string;
}

export interface Formation {
  slug: string;
  title: string;
  shortTitle: string;
  category: FormationCategoryId;
  categoryLabel: string;
  type: FormationType;
  typeLabel: string;
  level: FormationLevel;
  durationHours: number;
  durationLabel: string;
  price: FormationPrice;
  cpfEligible: boolean;
  cpfNote?: string;
  certificationCode?: string;
  certifications: string[];
  summary: string;
  imageKey: CategoryVisualTheme;
  pdfFilename: string;
  pdfUrl: string;
  pdfAvailable: boolean;
  contentStatus: FormationContentStatus;
  publicConcerned: string[];
  prerequisites: string[];
  presentation: string;
  objectives: string[];
  programme: FormationProgramme;
  registration: string[];
  evaluation: string[];
  pedagogicalTeam: string[];
  pedagogicalMeans: string[];
  followUp: string[];
  careerOutcomes: string[];
  accessibility: string;
}

export interface FormationCategory {
  id: FormationCategoryId;
  label: string;
  description: string;
  imageKey: CategoryVisualTheme;
  order: number;
}

export type FormationSort =
  | "default"
  | "duration-asc"
  | "duration-desc"
  | "price-asc"
  | "price-desc"
  | "name-asc";

export interface FormationFilters {
  query: string;
  category: FormationCategoryId | "all";
  type: FormationType | "all";
  level: "1" | "2" | "3" | "all";
  cpfOnly: boolean;
}

export const FORMATION_TYPE_LABELS: Record<FormationType, string> = {
  initial: "Initial",
  recyclage: "Recyclage",
  "remise-a-niveau": "Remise à niveau",
  mac: "MAC",
  certification: "Certification",
};

export const PENDING_CONTENT_MESSAGE =
  "Le contenu officiel de cette formation sera publié prochainement à partir du programme certifié.";
