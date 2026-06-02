import { CATEGORY_VISUAL_THEMES, type CategoryVisualTheme } from "@/lib/category-visuals";
import { FORMATION_CATEGORY_BY_ID } from "@/lib/formations/categories";
import { getFormationPdfUrl } from "@/lib/formations/pdf";
import {
  FORMATION_TYPE_LABELS,
  type Formation,
  type FormationCategoryId,
  type FormationLevel,
  type FormationModule,
  type FormationProgramme,
  type FormationType,
} from "@/lib/formations/types";

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const MAX_SLUG_LENGTH = 80;

const CATEGORY_IDS: FormationCategoryId[] = [
  "securite-incendie",
  "secourisme",
  "surete",
  "habilitation-electrique",
];
const TYPES: FormationType[] = ["initial", "recyclage", "remise-a-niveau", "mac", "certification"];
const THEMES = Object.keys(CATEGORY_VISUAL_THEMES) as CategoryVisualTheme[];

function trimStr(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function clampNumber(value: unknown, min: number, max: number): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return min;
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function clampOptionalHours(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return Math.min(100000, Math.round(parsed));
}

/** Deep-sanitize the programme: drop empty modules, trim, clamp hours. */
function sanitizeProgramme(value: unknown): FormationProgramme {
  if (!value || typeof value !== "object") return { modules: [] };
  const raw = value as Partial<FormationProgramme>;
  const modules: FormationModule[] = Array.isArray(raw.modules)
    ? raw.modules
        .map((module): FormationModule => {
          const title = trimStr((module as FormationModule)?.title, 160);
          return {
            title,
            hours: clampOptionalHours((module as FormationModule)?.hours),
            content: asStringArray((module as FormationModule)?.content),
          };
        })
        .filter((module) => module.title || module.content.length > 0)
    : [];

  const totalHours = clampOptionalHours(raw.totalHours);
  return totalHours === undefined ? { modules } : { totalHours, modules };
}

/** Accept an absolute (https) or root-relative cover URL, else drop it. */
function normalizeCoverImageUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > 500) return null;
  if (!/^(https?:\/\/|\/)/.test(trimmed)) return null;
  return trimmed;
}

/** Keep an uploaded (absolute http) PDF URL; reject anything else. */
function normalizeUploadedPdfUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 500) return null;
  return /^https?:\/\//.test(trimmed) ? trimmed : null;
}

export type NormalizeResult =
  | { ok: true; formation: Formation }
  | { ok: false; error: string };

/**
 * Sanitize + validate the editable "basics" while PRESERVING the rich content
 * fields (objectives, programme, etc.) that the basics editor does not expose.
 * Derived labels (categoryLabel, typeLabel) and pdfUrl are recomputed server-side.
 */
export function normalizeFormationDraft(input: Formation): NormalizeResult {
  const title = trimStr(input.title, 160);
  if (!title) return { ok: false, error: "Le titre est requis." };

  if (!CATEGORY_IDS.includes(input.category)) {
    return { ok: false, error: "Catégorie invalide." };
  }
  const category = input.category;

  const type = TYPES.includes(input.type) ? input.type : "initial";

  const rawLevel = input.level as string | null;
  const level: FormationLevel =
    category === "securite-incendie" && (rawLevel === "1" || rawLevel === "2" || rawLevel === "3")
      ? rawLevel
      : null;

  const imageKey = THEMES.includes(input.imageKey) ? input.imageKey : "incendie";

  const summary = trimStr(input.summary, 600);
  if (!summary) return { ok: false, error: "Le résumé est requis." };

  const pdfFilename = trimStr(input.pdfFilename, 200);
  // An admin-uploaded PDF stores an absolute Supabase URL; preserve it.
  // Otherwise fall back to the static catalog path computed from the filename.
  const uploadedPdfUrl = normalizeUploadedPdfUrl(input.pdfUrl);
  const pdfUrl = uploadedPdfUrl ?? (pdfFilename ? getFormationPdfUrl(pdfFilename) : "");
  const pdfAvailable = Boolean(input.pdfAvailable) && Boolean(pdfUrl);

  const priceNote = trimStr(input.price?.note, 200);
  const priceShortLabel = trimStr(input.price?.shortLabel, 80);
  const cpfNote = trimStr(input.cpfNote, 200);
  const certificationCode = trimStr(input.certificationCode, 60);

  const formation: Formation = {
    ...input,
    slug: input.slug,
    title,
    shortTitle: trimStr(input.shortTitle, 120) || title,
    category,
    categoryLabel: FORMATION_CATEGORY_BY_ID[category].label,
    type,
    typeLabel: FORMATION_TYPE_LABELS[type],
    level,
    durationHours: clampNumber(input.durationHours, 0, 100000),
    durationLabel: trimStr(input.durationLabel, 80) || "—",
    price: {
      amount: clampNumber(input.price?.amount, 0, 10_000_000),
      currency: "EUR",
      label: trimStr(input.price?.label, 80) || "—",
      ...(priceShortLabel ? { shortLabel: priceShortLabel } : {}),
      ...(priceNote ? { note: priceNote } : {}),
    },
    cpfEligible: Boolean(input.cpfEligible),
    cpfNote: cpfNote || undefined,
    certificationCode: certificationCode || undefined,
    certifications: asStringArray(input.certifications),
    summary,
    imageKey,
    coverImageUrl: normalizeCoverImageUrl(input.coverImageUrl),
    pdfFilename,
    pdfUrl,
    pdfAvailable,
    contentStatus: input.contentStatus === "published" ? "published" : "stub",
    // Rich content fields are preserved as-is from the spread above, coerced to arrays.
    publicConcerned: asStringArray(input.publicConcerned),
    prerequisites: asStringArray(input.prerequisites),
    presentation: typeof input.presentation === "string" ? input.presentation : "",
    objectives: asStringArray(input.objectives),
    programme: sanitizeProgramme(input.programme),
    registration: asStringArray(input.registration),
    evaluation: asStringArray(input.evaluation),
    pedagogicalTeam: asStringArray(input.pedagogicalTeam),
    pedagogicalMeans: asStringArray(input.pedagogicalMeans),
    followUp: asStringArray(input.followUp),
    careerOutcomes: asStringArray(input.careerOutcomes),
    accessibility: typeof input.accessibility === "string" ? input.accessibility : "",
  };

  return { ok: true, formation };
}
