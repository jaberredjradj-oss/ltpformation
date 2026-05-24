import {
  mapRowToDevisRequest,
  mapRowToPreinscription,
} from "@/lib/db/mappers";
import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import type { DevisRequestRow, PreinscriptionRow } from "@/lib/db/types";
import type { DevisRequestStatus, PreinscriptionStatus } from "@/lib/admin/types";
import type { SubmissionsRepository } from "@/lib/repositories/types";

export const supabaseSubmissionsRepository: SubmissionsRepository = {
  async createDevis(input) {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const now = new Date().toISOString();
    const { data, error } = await client
      .from("devis_requests")
      .insert({
        company: input.company,
        contact_first_name: input.contactFirstName,
        contact_last_name: input.contactLastName,
        email: input.email,
        phone: input.phone,
        formation_slug: input.formationSlug,
        formation_title: input.formationTitle,
        session_id: input.sessionId,
        session_snapshot: input.sessionSnapshot,
        participant_count: input.participantCount,
        employee_count: input.employeeCount,
        on_site_training: input.onSiteTraining,
        message: input.message,
        status: "new",
        submitted_at: now,
        updated_at: now,
      })
      .select("id")
      .single();

    if (error) throw error;
    return { id: data.id as string };
  },

  async createPreinscription(input) {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const now = new Date().toISOString();
    const { data, error } = await client
      .from("preinscriptions")
      .insert({
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email,
        phone: input.phone,
        formation_slug: input.formationSlug,
        formation_title: input.formationTitle,
        session_id: input.sessionId,
        session_snapshot: input.sessionSnapshot,
        cpf_financing: input.cpfFinancing,
        message: input.message,
        status: "pending",
        submitted_at: now,
        updated_at: now,
      })
      .select("id")
      .single();

    if (error) throw error;
    return { id: data.id as string };
  },

  async listDevisRequests() {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const { data, error } = await client
      .from("devis_requests")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) throw error;
    return (data as DevisRequestRow[]).map(mapRowToDevisRequest);
  },

  async listPreinscriptions() {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const { data, error } = await client
      .from("preinscriptions")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) throw error;
    return (data as PreinscriptionRow[]).map(mapRowToPreinscription);
  },

  async updateDevisStatus(id, status: DevisRequestStatus) {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const { error } = await client
      .from("devis_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  },

  async updatePreinscriptionStatus(id, status: PreinscriptionStatus) {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const { error } = await client
      .from("preinscriptions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  },
};
