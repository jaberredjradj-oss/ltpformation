import type { FormationRow } from "@/lib/db/types";
import type { CategoryVisualTheme } from "@/lib/category-visuals";
import { FORMATION_CATEGORY_BY_ID } from "@/lib/formations/categories";
import {
  FORMATION_TYPE_LABELS,
  type Formation,
  type FormationCategoryId,
  type FormationContentStatus,
  type FormationLevel,
  type FormationPrice,
  type FormationProgramme,
  type FormationType,
} from "@/lib/formations/types";
import type { FormationWriteInput, ManagedFormation } from "@/lib/repositories/formations/types";

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function asProgramme(value: unknown): FormationProgramme {
  if (value && typeof value === "object" && Array.isArray((value as FormationProgramme).modules)) {
    return value as FormationProgramme;
  }
  return { modules: [] };
}

function asPrice(value: unknown): FormationPrice {
  if (value && typeof value === "object" && typeof (value as FormationPrice).amount === "number") {
    return value as FormationPrice;
  }
  return { amount: 0, currency: "EUR", label: "" };
}

/** Build the public Formation shape from a DB row (with safe defaults). */
export function mapRowToFormation(row: FormationRow): Formation {
  const category = row.category as FormationCategoryId;
  const categoryLabel =
    row.category_label || FORMATION_CATEGORY_BY_ID[category]?.label || "";
  const type = (row.type ?? "initial") as FormationType;

  return {
    slug: row.slug,
    title: row.title,
    shortTitle: row.short_title || row.title,
    category,
    categoryLabel,
    type,
    typeLabel: row.type_label || FORMATION_TYPE_LABELS[type] || "",
    level: (row.level ?? null) as FormationLevel,
    durationHours: row.duration_hours ?? 0,
    durationLabel: row.duration_label || "",
    price: asPrice(row.price),
    cpfEligible: Boolean(row.cpf_eligible),
    cpfNote: row.cpf_note ?? undefined,
    certificationCode: row.certification_code ?? undefined,
    certifications: asStringArray(row.certifications),
    summary: row.summary || "",
    imageKey: (row.image_key ?? "incendie") as CategoryVisualTheme,
    pdfFilename: row.pdf_filename || "",
    pdfUrl: row.pdf_url || "",
    pdfAvailable: Boolean(row.pdf_available),
    contentStatus: (row.content_status ?? "published") as FormationContentStatus,
    publicConcerned: asStringArray(row.public_concerned),
    prerequisites: asStringArray(row.prerequisites),
    presentation: row.presentation || "",
    objectives: asStringArray(row.objectives),
    programme: asProgramme(row.programme),
    registration: asStringArray(row.registration),
    evaluation: asStringArray(row.evaluation),
    pedagogicalTeam: asStringArray(row.pedagogical_team),
    pedagogicalMeans: asStringArray(row.pedagogical_means),
    followUp: asStringArray(row.follow_up),
    careerOutcomes: asStringArray(row.career_outcomes),
    accessibility: row.accessibility || "",
  };
}

export function mapRowToManagedFormation(row: FormationRow): ManagedFormation {
  return {
    formation: mapRowToFormation(row),
    active: Boolean(row.active),
    sortOrder: row.sort_order ?? 0,
    coverImageUrl: row.cover_image_url ?? null,
    source: row.source ?? "admin",
    updatedAt: row.updated_at ?? null,
  };
}

/** Serialize a write input into a DB row (without created_at). */
export function mapInputToRow(input: FormationWriteInput): Omit<FormationRow, "created_at"> {
  const f = input.formation;
  return {
    slug: f.slug,
    title: f.title,
    short_title: f.shortTitle,
    category: f.category,
    category_label: f.categoryLabel,
    type: f.type,
    type_label: f.typeLabel,
    level: f.level,
    duration_hours: f.durationHours,
    duration_label: f.durationLabel,
    price: f.price,
    cpf_eligible: f.cpfEligible,
    cpf_note: f.cpfNote ?? null,
    certification_code: f.certificationCode ?? null,
    certifications: f.certifications,
    summary: f.summary,
    image_key: f.imageKey,
    cover_image_url: input.coverImageUrl ?? null,
    pdf_filename: f.pdfFilename,
    pdf_url: f.pdfUrl,
    pdf_available: f.pdfAvailable,
    content_status: f.contentStatus,
    public_concerned: f.publicConcerned,
    prerequisites: f.prerequisites,
    presentation: f.presentation,
    objectives: f.objectives,
    programme: f.programme,
    registration: f.registration,
    evaluation: f.evaluation,
    pedagogical_team: f.pedagogicalTeam,
    pedagogical_means: f.pedagogicalMeans,
    follow_up: f.followUp,
    career_outcomes: f.careerOutcomes,
    accessibility: f.accessibility,
    active: input.active,
    sort_order: input.sortOrder ?? 0,
    source: input.source ?? "admin",
    updated_at: new Date().toISOString(),
  };
}
