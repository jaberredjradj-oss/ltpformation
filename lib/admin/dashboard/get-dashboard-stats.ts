import {
  countFullSessions,
  countTotalSessions,
  countUpcomingSessions,
} from "@/lib/admin/planning/get-admin-sessions";
import { getMessagesRepository, getSubmissionsRepository } from "@/lib/repositories";
import type { AdminActivityItem, AdminDashboardStats } from "@/lib/admin/types";

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [devis, preinscriptions, messages, totalSessions, upcomingSessions, fullSessions] =
    await Promise.all([
      getSubmissionsRepository().then((repo) => repo.listDevisRequests()),
      getSubmissionsRepository().then((repo) => repo.listPreinscriptions()),
      getMessagesRepository().then((repo) => repo.listContactMessages()),
      countTotalSessions(),
      countUpcomingSessions(),
      countFullSessions(),
    ]);

  return {
    totalSessions,
    upcomingSessions,
    fullSessions,
    pendingDevis: devis.filter((item) => item.status === "new").length,
    pendingPreinscriptions: preinscriptions.filter((item) => item.status === "pending").length,
    unreadMessages: messages.filter((item) => item.status === "unread").length,
  };
}

export async function getRecentAdminActivity(limit = 6): Promise<AdminActivityItem[]> {
  const [devis, preinscriptions, messages] = await Promise.all([
    getSubmissionsRepository().then((repo) => repo.listDevisRequests()),
    getSubmissionsRepository().then((repo) => repo.listPreinscriptions()),
    getMessagesRepository().then((repo) => repo.listContactMessages()),
  ]);

  const items: AdminActivityItem[] = [
    ...devis.map((item) => ({
      id: item.id,
      type: "devis" as const,
      label: `Devis — ${item.company}`,
      detail: item.formationTitle,
      submittedAt: item.submittedAt,
    })),
    ...preinscriptions.map((item) => ({
      id: item.id,
      type: "preinscription" as const,
      label: `Pré-inscription — ${item.firstName} ${item.lastName}`,
      detail: item.formationTitle,
      submittedAt: item.submittedAt,
    })),
    ...messages.map((item) => ({
      id: item.id,
      type: "message" as const,
      label: `Message — ${item.firstName} ${item.lastName}`,
      detail: item.message.slice(0, 80) + (item.message.length > 80 ? "…" : ""),
      submittedAt: item.submittedAt,
    })),
  ];

  return items
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, limit);
}
