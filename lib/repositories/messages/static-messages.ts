import { MOCK_CONTACT_MESSAGES } from "@/lib/admin/mock/contact-messages";
import type { AdminContactMessage, ContactMessageStatus } from "@/lib/admin/types";
import type { MessagesRepository } from "@/lib/repositories/types";

let messageStore: AdminContactMessage[] = [...MOCK_CONTACT_MESSAGES];

export const staticMessagesRepository: MessagesRepository = {
  async createMessage(input) {
    const id = `msg-${Date.now().toString(36)}`;
    messageStore = [
      {
        id,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone ?? undefined,
        message: input.message,
        status: "unread",
        submittedAt: new Date().toISOString(),
      },
      ...messageStore,
    ];
    return { id };
  },

  async listContactMessages() {
    return [...messageStore].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );
  },

  async updateMessageStatus(id, status: ContactMessageStatus) {
    messageStore = messageStore.map((item) => (item.id === id ? { ...item, status } : item));
  },
};

export function resetStaticMessages(): void {
  messageStore = [...MOCK_CONTACT_MESSAGES];
}
