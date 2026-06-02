import type {
  FormationCategoryId,
  FormationContentStatus,
  FormationPrice,
  FormationProgramme,
  FormationType,
} from "@/lib/formations/types";
import type { CategoryVisualTheme } from "@/lib/category-visuals";
import type { PlanningSessionStatus } from "@/lib/planning/types";

/**
 * Admin-managed formation row (table `formations`, migration 006).
 * Optional at runtime — overlays the static catalog. jsonb columns are
 * returned already parsed by supabase-js.
 */
export interface FormationRow {
  slug: string;
  title: string;
  short_title: string;
  category: FormationCategoryId;
  category_label: string;
  type: FormationType;
  type_label: string;
  level: string | null;
  duration_hours: number;
  duration_label: string;
  price: FormationPrice | null;
  cpf_eligible: boolean;
  cpf_note: string | null;
  certification_code: string | null;
  certifications: string[];
  summary: string;
  image_key: CategoryVisualTheme;
  cover_image_url: string | null;
  pdf_filename: string;
  pdf_url: string;
  pdf_available: boolean;
  content_status: FormationContentStatus;
  public_concerned: string[];
  prerequisites: string[];
  presentation: string;
  objectives: string[];
  programme: FormationProgramme;
  registration: string[];
  evaluation: string[];
  pedagogical_team: string[];
  pedagogical_means: string[];
  follow_up: string[];
  career_outcomes: string[];
  accessibility: string;
  active: boolean;
  sort_order: number;
  source: "admin" | "static-override";
  created_at?: string;
  updated_at?: string;
}

export interface PlanningSessionRow {
  id: string;
  formation_slug: string | null;
  formation_title: string;
  session_type: string;
  category: FormationCategoryId;
  category_label: string;
  start_date: string;
  end_date: string;
  exam_date: string | null;
  schedule_label: string;
  location: string;
  notes: string[];
  cpf_eligible: boolean;
  certification_code: string | null;
  status: PlanningSessionStatus;
  seats_total: number | null;
  seats_taken: number | null;
  visible: boolean;
  year: number;
  created_at?: string;
  updated_at?: string;
}

export type DevisRequestStatusRow = "new" | "contacted" | "processed" | "archived";

export interface DevisRequestRow {
  id: string;
  company: string;
  contact_first_name: string;
  contact_last_name: string;
  email: string;
  phone: string;
  formation_slug: string;
  formation_title: string;
  session_id: string | null;
  session_snapshot: Record<string, unknown> | null;
  participant_count: number;
  employee_count: number | null;
  on_site_training: string | null;
  message: string | null;
  status: DevisRequestStatusRow;
  submitted_at: string;
  updated_at: string;
}

export type PreinscriptionStatusRow = "pending" | "validated" | "refused" | "archived";

export interface PreinscriptionRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  formation_slug: string;
  formation_title: string;
  session_id: string;
  session_snapshot: Record<string, unknown> | null;
  cpf_financing: string | null;
  message: string | null;
  status: PreinscriptionStatusRow;
  submitted_at: string;
  updated_at: string;
}

export type ContactMessageStatusRow = "unread" | "answered" | "archived";

export interface ContactMessageRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  message: string;
  status: ContactMessageStatusRow;
  submitted_at: string;
  updated_at: string;
}

export interface NotificationEventRow {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  status: "pending" | "sent" | "failed";
  created_at: string;
}

export type EntityDocumentTypeRow = "preinscription" | "devis" | "message";

export type EntityDocumentUploaderRow = "candidate" | "admin";

export interface EntityDocumentRow {
  id: string;
  entity_type: EntityDocumentTypeRow;
  entity_id: string;
  file_name: string;
  document_kind: string;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  uploaded_by: EntityDocumentUploaderRow;
  uploaded_at: string;
}
