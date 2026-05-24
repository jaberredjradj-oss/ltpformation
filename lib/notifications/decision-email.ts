import { isRealDataEnabled } from "@/lib/db/env";
import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import type {
  DecisionEmailLogPayload,
  NotificationDeliveryStatus,
} from "@/lib/notifications/types";

interface LogDecisionEmailInput {
  type: string;
  status: NotificationDeliveryStatus;
  payload: DecisionEmailLogPayload;
}

export async function logDecisionEmailAttempt(
  input: LogDecisionEmailInput,
): Promise<string | null> {
  if (!isRealDataEnabled()) {
    console.info("[notification:decision-email]", input);
    return null;
  }

  const client = getSupabaseServerClient();
  if (!client) {
    console.info("[notification:decision-email]", input);
    return null;
  }

  const { data, error } = await client
    .from("notification_events")
    .insert({
      type: input.type,
      payload: input.payload,
      status: input.status,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[notification:decision-email:log]", error.message);
    return null;
  }

  return data.id as string;
}

export async function updateDecisionEmailLogStatus(
  eventId: string | null,
  status: NotificationDeliveryStatus,
  payloadPatch?: Partial<DecisionEmailLogPayload>,
): Promise<void> {
  if (!eventId || !isRealDataEnabled()) {
    return;
  }

  const client = getSupabaseServerClient();
  if (!client) return;

  const { data: existing, error: readError } = await client
    .from("notification_events")
    .select("payload")
    .eq("id", eventId)
    .maybeSingle();

  if (readError || !existing) {
    console.error("[notification:decision-email:update]", readError?.message ?? "Event not found");
    return;
  }

  const payload = {
    ...(existing.payload as Record<string, unknown>),
    ...payloadPatch,
  };

  const { error } = await client
    .from("notification_events")
    .update({ status, payload })
    .eq("id", eventId);

  if (error) {
    console.error("[notification:decision-email:update]", error.message);
  }
}
