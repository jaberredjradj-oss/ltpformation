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
