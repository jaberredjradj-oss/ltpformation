import { MOCK_CONTACT_MESSAGES } from "@/lib/admin/mock/contact-messages";
import type { MessagesRepository } from "@/lib/admin/repositories/types";

export const mockMessagesRepository: MessagesRepository = {
  async listContactMessages() {
    return [...MOCK_CONTACT_MESSAGES].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );
  },
};
