export type NotificationDeliveryStatus = "pending" | "sent" | "failed" | "skipped";

export type NotificationType =
  | "devis.created"
  | "preinscription.created"
  | "contact.created"
  | "contact.reply"
  | "preinscription.accepted"
  | "preinscription.refused"
  | "devis.followup";

export interface NotificationEvent {
  type: NotificationType | string;
  payload: Record<string, unknown>;
}

export interface NotificationDispatcher {
  dispatch(event: NotificationEvent): Promise<void>;
}

export interface DecisionEmailLogPayload {
  recipient: string;
  subject: string;
  entityType: "preinscription" | "devis" | "contact_message";
  entityId: string;
  newStatus?: string;
  messagePreview: string;
  provider: "resend" | "smtp" | "stub";
  error?: string | null;
}
