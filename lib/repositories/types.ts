import type { PlanningSession } from "@/lib/planning/types";

export interface PlanningRepository {
  listAll(): Promise<PlanningSession[]>;
  getById(id: string): Promise<PlanningSession | null>;
  create(session: PlanningSession): Promise<PlanningSession>;
  update(id: string, patch: Partial<PlanningSession>): Promise<PlanningSession>;
  upsertMany(sessions: PlanningSession[]): Promise<void>;
}

export interface CreateDevisInput {
  company: string;
  contactFirstName: string;
  contactLastName: string;
  email: string;
  phone: string;
  formationSlug: string;
  formationTitle: string;
  sessionId: string | null;
  sessionSnapshot: Record<string, unknown> | null;
  participantCount: number;
  employeeCount: number | null;
  onSiteTraining: string | null;
  message: string | null;
}

export interface CreatePreinscriptionInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  formationSlug: string;
  formationTitle: string;
  sessionId: string;
  sessionSnapshot: Record<string, unknown> | null;
  cpfFinancing: string | null;
  message: string | null;
}

export interface CreateContactMessageInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  message: string;
}

export interface SubmissionsRepository {
  createDevis(input: CreateDevisInput): Promise<{ id: string }>;
  createPreinscription(input: CreatePreinscriptionInput): Promise<{ id: string }>;
  listDevisRequests(): Promise<import("@/lib/admin/types").AdminDevisRequest[]>;
  listPreinscriptions(): Promise<import("@/lib/admin/types").AdminPreinscription[]>;
  updateDevisStatus(id: string, status: import("@/lib/admin/types").DevisRequestStatus): Promise<void>;
  updatePreinscriptionStatus(
    id: string,
    status: import("@/lib/admin/types").PreinscriptionStatus,
  ): Promise<void>;
}

export interface MessagesRepository {
  createMessage(input: CreateContactMessageInput): Promise<{ id: string }>;
  listContactMessages(): Promise<import("@/lib/admin/types").AdminContactMessage[]>;
  updateMessageStatus(
    id: string,
    status: import("@/lib/admin/types").ContactMessageStatus,
  ): Promise<void>;
}
