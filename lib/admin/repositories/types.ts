import type {
  AdminContactMessage,
  AdminDevisRequest,
  AdminPreinscription,
} from "@/lib/admin/types";

export interface SubmissionsRepository {
  listDevisRequests(): Promise<AdminDevisRequest[]>;
  listPreinscriptions(): Promise<AdminPreinscription[]>;
}

export interface MessagesRepository {
  listContactMessages(): Promise<AdminContactMessage[]>;
}
