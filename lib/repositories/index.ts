import { isRealDataEnabled } from "@/lib/db/env";
import { supabaseDocumentsRepository } from "@/lib/repositories/documents/supabase-documents";
import { staticDocumentsRepository } from "@/lib/repositories/documents/static-documents";
import { supabaseMessagesRepository } from "@/lib/repositories/messages/supabase-messages";
import { staticMessagesRepository } from "@/lib/repositories/messages/static-messages";
import { supabaseSubmissionsRepository } from "@/lib/repositories/submissions/supabase-submissions";
import { staticSubmissionsRepository } from "@/lib/repositories/submissions/static-submissions";
import type { DocumentsRepository } from "@/lib/repositories/documents/types";
import type { MessagesRepository, SubmissionsRepository } from "@/lib/repositories/types";

export async function getDocumentsRepository(): Promise<DocumentsRepository> {
  if (isRealDataEnabled()) {
    return supabaseDocumentsRepository;
  }
  return staticDocumentsRepository;
}

export async function getSubmissionsRepository(): Promise<SubmissionsRepository> {
  if (isRealDataEnabled()) {
    return supabaseSubmissionsRepository;
  }
  return staticSubmissionsRepository;
}

export async function getMessagesRepository(): Promise<MessagesRepository> {
  if (isRealDataEnabled()) {
    return supabaseMessagesRepository;
  }
  return staticMessagesRepository;
}

export { getPlanningRepository, loadPlanningSessions, findPlanningSessionById } from "@/lib/repositories/planning";
