import type {
  ContactMessageRow,
  DevisRequestRow,
  EntityDocumentRow,
  PlanningSessionRow,
  PreinscriptionRow,
} from "@/lib/db/types";
import type {
  AdminContactMessage,
  AdminDevisRequest,
  AdminPreinscription,
} from "@/lib/admin/types";
import type { EntityDocument } from "@/lib/documents/types";
import type { PlanningSession } from "@/lib/planning/types";
import { formatSessionDateRange } from "@/lib/planning/format";

export function mapRowToPlanningSession(row: PlanningSessionRow): PlanningSession {
  return {
    id: row.id,
    formationSlug: row.formation_slug,
    formationTitle: row.formation_title,
    sessionType: row.session_type,
    category: row.category,
    categoryLabel: row.category_label,
    startDate: row.start_date,
    endDate: row.end_date,
    examDate: row.exam_date,
    scheduleLabel: row.schedule_label,
    location: row.location,
    notes: row.notes ?? [],
    cpfEligible: row.cpf_eligible,
    certificationCode: row.certification_code,
    status: row.status,
    seatsTotal: row.seats_total,
    seatsTaken: row.seats_taken,
    visible: row.visible,
    year: row.year,
  };
}

export function mapPlanningSessionToRow(session: PlanningSession): PlanningSessionRow {
  return {
    id: session.id,
    formation_slug: session.formationSlug,
    formation_title: session.formationTitle,
    session_type: session.sessionType,
    category: session.category,
    category_label: session.categoryLabel,
    start_date: session.startDate,
    end_date: session.endDate,
    exam_date: session.examDate,
    schedule_label: session.scheduleLabel,
    location: session.location,
    notes: session.notes,
    cpf_eligible: session.cpfEligible,
    certification_code: session.certificationCode,
    status: session.status,
    seats_total: session.seatsTotal,
    seats_taken: session.seatsTaken,
    visible: session.visible,
    year: session.year,
  };
}

export function mapRowToDevisRequest(row: DevisRequestRow): AdminDevisRequest {
  const snapshot = row.session_snapshot as { dateRange?: string } | null;

  return {
    id: row.id,
    company: row.company,
    contactName: `${row.contact_first_name} ${row.contact_last_name}`.trim(),
    email: row.email,
    phone: row.phone,
    formationSlug: row.formation_slug,
    formationTitle: row.formation_title,
    sessionId: row.session_id,
    sessionLabel: snapshot?.dateRange ?? null,
    participantCount: row.participant_count,
    onSiteTraining: row.on_site_training,
    status: row.status,
    submittedAt: row.submitted_at,
  };
}

export function mapRowToPreinscription(row: PreinscriptionRow): AdminPreinscription {
  const snapshot = row.session_snapshot as { dateRange?: string } | null;

  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    formationSlug: row.formation_slug,
    formationTitle: row.formation_title,
    sessionId: row.session_id,
    sessionLabel: snapshot?.dateRange ?? row.session_id,
    cpfFinancing: row.cpf_financing,
    status: row.status,
    submittedAt: row.submitted_at,
  };
}

export function mapRowToContactMessage(row: ContactMessageRow): AdminContactMessage {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone ?? undefined,
    message: row.message,
    status: row.status,
    submittedAt: row.submitted_at,
  };
}

export function buildSessionLabelFromRow(row: PlanningSessionRow | null): string | null {
  if (!row) return null;
  return formatSessionDateRange(row.start_date, row.end_date);
}

export function mapRowToEntityDocument(row: EntityDocumentRow): EntityDocument {
  return {
    id: row.id,
    entityType: row.entity_type,
    entityId: row.entity_id,
    documentKind: (row.document_kind ?? "other") as EntityDocument["documentKind"],
    fileName: row.file_name,
    storagePath: row.storage_path,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    uploadedBy: row.uploaded_by,
    uploadedAt: row.uploaded_at,
  };
}
