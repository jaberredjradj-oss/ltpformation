import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import type { FormationRow } from "@/lib/db/types";
import {
  mapInputToRow,
  mapRowToManagedFormation,
} from "@/lib/repositories/formations/mappers";
import type {
  FormationWriteInput,
  FormationsRepository,
  ManagedFormation,
} from "@/lib/repositories/formations/types";

const TABLE = "formations";

export const supabaseFormationsRepository: FormationsRepository = {
  async listAll(): Promise<ManagedFormation[]> {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const { data, error } = await client
      .from(TABLE)
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data as FormationRow[]).map(mapRowToManagedFormation);
  },

  async getBySlug(slug: string): Promise<ManagedFormation | null> {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const { data, error } = await client
      .from(TABLE)
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    return data ? mapRowToManagedFormation(data as FormationRow) : null;
  },

  async create(input: FormationWriteInput): Promise<ManagedFormation> {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const row = mapInputToRow(input);
    const { data, error } = await client
      .from(TABLE)
      .insert(row)
      .select("*")
      .single();

    if (error) throw error;
    return mapRowToManagedFormation(data as FormationRow);
  },

  async update(slug: string, input: FormationWriteInput): Promise<ManagedFormation> {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const row = mapInputToRow(input);
    const { data, error } = await client
      .from(TABLE)
      .update(row)
      .eq("slug", slug)
      .select("*")
      .single();

    if (error) throw error;
    return mapRowToManagedFormation(data as FormationRow);
  },

  async delete(slug: string): Promise<void> {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const { error } = await client.from(TABLE).delete().eq("slug", slug);
    if (error) throw error;
  },
};
