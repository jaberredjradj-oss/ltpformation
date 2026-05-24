import { FORMATION_CATEGORY_BY_ID } from "@/lib/formations/categories";
import { getFormationPdfUrl } from "@/lib/formations/pdf";
import {
  FORMATION_TYPE_LABELS,
  PENDING_CONTENT_MESSAGE,
  type Formation,
  type FormationCategoryId,
  type FormationLevel,
  type FormationType,
} from "@/lib/formations/types";
import type { CategoryVisualTheme } from "@/lib/category-visuals";

interface FormationStubDefinition {
  slug: string;
  title: string;
  shortTitle: string;
  category: FormationCategoryId;
  type: FormationType;
  level: FormationLevel;
  imageKey: CategoryVisualTheme;
  cpfEligible?: boolean;
}

export function createFormationStub(definition: FormationStubDefinition): Formation {
  const category = FORMATION_CATEGORY_BY_ID[definition.category];

  return {
    slug: definition.slug,
    title: definition.title,
    shortTitle: definition.shortTitle,
    category: definition.category,
    categoryLabel: category.label,
    type: definition.type,
    typeLabel: FORMATION_TYPE_LABELS[definition.type],
    level: definition.level,
    durationHours: 0,
    durationLabel: "—",
    price: {
      amount: 0,
      currency: "EUR",
      label: "—",
    },
    cpfEligible: definition.cpfEligible ?? false,
    certifications: ["Qualiopi"],
    summary: PENDING_CONTENT_MESSAGE,
    imageKey: definition.imageKey,
    pdfFilename: `${definition.slug}.pdf`,
    pdfUrl: getFormationPdfUrl(`${definition.slug}.pdf`),
    pdfAvailable: false,
    contentStatus: "stub",
    publicConcerned: [],
    prerequisites: [],
    presentation: "",
    objectives: [],
    programme: { modules: [] },
    registration: [],
    evaluation: [],
    pedagogicalTeam: [],
    pedagogicalMeans: [],
    followUp: [],
    careerOutcomes: [],
    accessibility: "",
  };
}
