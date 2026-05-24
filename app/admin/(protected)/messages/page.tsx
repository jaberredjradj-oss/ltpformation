import { ContactMessagesTable } from "@/components/admin/messages/ContactMessagesTable";
import { getMessagesRepository } from "@/lib/repositories";

export default async function AdminMessagesPage() {
  const messages = await getMessagesRepository().then((repo) => repo.listContactMessages());

  return <ContactMessagesTable messages={messages} />;
}
