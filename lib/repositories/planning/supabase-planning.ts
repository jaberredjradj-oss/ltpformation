import { mapPlanningSessionToRow, mapRowToPlanningSession } from "@/lib/db/mappers";
import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import type { PlanningSessionRow } from "@/lib/db/types";
import type { PlanningRepository } from "@/lib/repositories/types";

export const supabasePlanningRepository: PlanningRepository = {
  async listAll() {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const { data, error } = await client
      .from("planning_sessions")
      .select("*")
      .order("start_date", { ascending: true });

    if (error) throw error;
    return (data as PlanningSessionRow[]).map(mapRowToPlanningSession);
  },

  async getById(id) {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const { data, error } = await client
      .from("planning_sessions")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapRowToPlanningSession(data as PlanningSessionRow) : null;
  },

  async create(session) {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const row = mapPlanningSessionToRow(session);
    const { data, error } = await client
      .from("planning_sessions")
      .insert({ ...row, updated_at: new Date().toISOString() })
      .select("*")
      .single();

    if (error) throw error;
    return mapRowToPlanningSession(data as PlanningSessionRow);
  },

  async update(id, patch) {
    const existing = await this.getById(id);
    if (!existing) throw new Error(`Session introuvable: ${id}`);

    const merged = { ...existing, ...patch, notes: patch.notes ?? existing.notes };
    const row = mapPlanningSessionToRow(merged);

    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const { data, error } = await client
      .from("planning_sessions")
      .update({ ...row, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return mapRowToPlanningSession(data as PlanningSessionRow);
  },

  async upsertMany(sessions) {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const rows = sessions.map((session) => ({
      ...mapPlanningSessionToRow(session),
      updated_at: new Date().toISOString(),
    }));

    const { error } = await client.from("planning_sessions").upsert(rows, { onConflict: "id" });
    if (error) throw error;
  },

  async delete(id) {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const { error } = await client.from("planning_sessions").delete().eq("id", id);
    if (error) throw error;
  },
};
