export type DevisRequestStatus = "new" | "contacted" | "processed" | "archived";

export type PreinscriptionStatus = "pending" | "validated" | "refused" | "archived";

export type ContactMessageStatus = "unread" | "answered" | "archived";

export interface AdminDevisRequest {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  formationSlug: string;
  formationTitle: string;
  sessionId: string | null;
  sessionLabel: string | null;
  participantCount: number;
  onSiteTraining: string | null;
  status: DevisRequestStatus;
  submittedAt: string;
}

export interface AdminPreinscription {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  formationSlug: string;
  formationTitle: string;
  sessionId: string;
  sessionLabel: string;
  cpfFinancing: string | null;
  status: PreinscriptionStatus;
  submittedAt: string;
}

export interface AdminContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  status: ContactMessageStatus;
  submittedAt: string;
}

/** Types d'entités supprimables individuellement vers la corbeille. */
export type TrashEntityType = "preinscription" | "devis" | "message";

/** Un enregistrement en corbeille (pré-inscription, devis ou message). */
export interface AdminTrashedItem {
  entityType: TrashEntityType;
  id: string;
  /** Nom principal affiché : apprenant, entreprise ou expéditeur. */
  primaryLabel: string;
  /** Détail secondaire : formation, contact, extrait de message… */
  secondaryLabel: string | null;
  email: string | null;
  deletedAt: string;
  deleteExpiresAt: string;
}

export interface AdminPlanningRow {
  id: string;
  formationTitle: string;
  formationSlug: string | null;
  categoryLabel: string | null;
  dateLabel: string;
  startDate: string | null;
  monthKey: string | null;
  durationLabel: string;
  location: string;
  seatsTotal: number | null;
  seatsTaken: number | null;
  seatsRemaining: number | null;
  availabilityLabel: string;
  status: string;
  visible: boolean;
}

export interface AdminDashboardStats {
  totalSessions: number;
  upcomingSessions: number;
  fullSessions: number;
  pendingDevis: number;
  pendingPreinscriptions: number;
  unreadMessages: number;
}

export interface AdminActivityItem {
  id: string;
  type: "devis" | "preinscription" | "message";
  label: string;
  detail: string;
  submittedAt: string;
}

export interface AdminSessionInput {
  id?: string;
  formationSlug: string | null;
  formationTitle: string;
  sessionType: string;
  category: string;
  categoryLabel: string;
  startDate: string;
  endDate: string;
  examDate: string | null;
  scheduleLabel: string;
  location: string;
  seatsTotal: number | null;
  seatsTaken: number | null;
  status: "open" | "limited" | "full" | "cancelled";
  visible: boolean;
  cpfEligible: boolean;
  certificationCode: string | null;
}

/** Full editable snapshot of a session for the admin editor (prefill). */
export interface AdminEditableSession extends Required<Omit<AdminSessionInput, "id">> {
  id: string;
}

/** Formation choice for the session editor dropdown. */
export interface AdminFormationOption {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  cpfEligible: boolean;
  certificationCode: string | null;
}
