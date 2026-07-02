export { isAdminAccessGranted, isAdminDemoMode, getAdminSession, requireAdminSession, assertAdminAccess } from "@/lib/admin/auth";
export { signInAdmin, signOutAdmin } from "@/lib/admin/auth-actions";
export { ADMIN_NAV_ITEMS, DEVIS_STATUS_LABELS, MESSAGE_STATUS_LABELS, PREINSCRIPTION_STATUS_LABELS } from "@/lib/admin/constants";
export type {
  AdminActivityItem,
  AdminContactMessage,
  AdminDashboardStats,
  AdminDevisRequest,
  AdminPlanningRow,
  AdminPreinscription,
  AdminTrashedItem,
  TrashEntityType,
  ContactMessageStatus,
  DevisRequestStatus,
  PreinscriptionStatus,
} from "@/lib/admin/types";
export { getRecentAdminActivity, getAdminDashboardStats } from "@/lib/admin/dashboard/get-dashboard-stats";
export { getAdminPlanningRows } from "@/lib/admin/planning/get-admin-sessions";
export {
  archiveSession,
  deleteSession,
  markSessionFull,
  saveSession,
  toggleSessionVisibility,
  updateContactMessageStatus,
  updateDevisStatus,
  updatePreinscriptionStatus,
  updateSessionSeats,
} from "@/lib/admin/actions";
export { purgeItem, restoreItem, trashItem } from "@/lib/admin/trash-actions";
export { getMessagesRepository, getSubmissionsRepository, getTrashRepository } from "@/lib/repositories";
