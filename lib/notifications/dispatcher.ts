import { isRealDataEnabled } from "@/lib/db/env";
import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import type { NotificationDispatcher, NotificationEvent } from "@/lib/notifications/types";

async function persistNotificationEvent(event: NotificationEvent): Promise<void> {
  if (!isRealDataEnabled()) {
    console.info("[notification:stub]", event.type, event.payload);
    return;
  }

  const client = getSupabaseServerClient();
  if (!client) {
    console.info("[notification:stub]", event.type, event.payload);
    return;
  }

  const { error } = await client.from("notification_events").insert({
    type: event.type,
    payload: event.payload,
    status: "pending",
  });

  if (error) {
    console.error("[notification:error]", error.message);
  }
}

export const notificationDispatcher: NotificationDispatcher = {
  async dispatch(event) {
    await persistNotificationEvent(event);
  },
};
