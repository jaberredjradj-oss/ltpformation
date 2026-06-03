import type { FormationCategory } from "@/lib/formations/types";

export const FORMATION_CATEGORIES: FormationCategory[] = [
  {
    id: "securite-incendie",
    label: "Sécurité incendie",
    description: "SSIAP, EPI et SSI — formations certifiantes en sécurité incendie.",
    imageKey: "incendie",
    order: 1,
  },
  {
    id: "secourisme",
    label: "Secourisme",
    description: "SST et MAC SST — secourisme en milieu professionnel.",
    imageKey: "secourisme",
    order: 2,
  },
  {
    id: "surete",
    label: "Sûreté",
    description: "TFP APS et MAC APS — agent de prévention et de sécurité.",
    imageKey: "surete",
    order: 3,
  },
  {
    id: "habilitation-electrique",
    label: "Prévention des risques",
    description: "H0B0-H0V et BSBE — habilitations réglementaires NF C 18-510.",
    imageKey: "habilitation",
    order: 4,
  },
];

export const FORMATION_CATEGORY_BY_ID = Object.fromEntries(
  FORMATION_CATEGORIES.map((category) => [category.id, category]),
) as Record<
  FormationCategory["id"],
  FormationCategory
>;
