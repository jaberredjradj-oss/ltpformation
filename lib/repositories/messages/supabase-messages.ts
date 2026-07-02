import { mapRowToContactMessage } from "@/lib/db/mappers";
import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import type { ContactMessageRow } from "@/lib/db/types";
import type { ContactMessageStatus } from "@/lib/admin/types";
import type { CreateContactMessageInput, MessagesRepository } from "@/lib/repositories/types";

export const supabaseMessagesRepository: MessagesRepository = {
  async createMessage(input: CreateContactMessageInput) {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const now = new Date().toISOString();
    const { data, error } = await client
      .from("contact_messages")
      .insert({
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email,
        phone: input.phone,
        message: input.message,
        status: "unread",
        submitted_at: now,
        updated_at: now,
      })
      .select("id")
      .single();

    if (error) throw error;
    return { id: data.id as string };
  },

  async listContactMessages() {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    let { data, error } = await client
      .from("contact_messages")
      .select("*")
      .is("deleted_at", null)
      .order("submitted_at", { ascending: false });

    // Migration 007 pas encore appliquée → colonne corbeille absente.
    if (error && error.message.toLowerCase().includes("deleted_at")) {
      ({ data, error } = await client
        .from("contact_messages")
        .select("*")
        .order("submitted_at", { ascending: false }));
    }

    if (error) throw error;
    return (data as ContactMessageRow[]).map(mapRowToContactMessage);
  },

  async updateMessageStatus(id, status: ContactMessageStatus) {
    const client = getSupabaseServerClient();
    if (!client) throw new Error("Supabase client unavailable.");

    const { error } = await client
      .from("contact_messages")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  },
};
