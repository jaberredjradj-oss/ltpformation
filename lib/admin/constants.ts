export const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/formations", label: "Formations" },
  { href: "/admin/planning", label: "Planning" },
  { href: "/admin/demandes", label: "Devis" },
  { href: "/admin/preinscriptions", label: "Pré-inscriptions" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/communication", label: "Communication" },
  { href: "/admin/corbeille", label: "Corbeille" },
] as const;

/** Délai de rétention en corbeille avant suppression définitive possible. */
export const TRASH_RETENTION_DAYS = 7;

/** Libellés (singulier) par type d'entité supprimable. */
export const TRASH_ENTITY_LABELS = {
  preinscription: "Pré-inscription",
  devis: "Devis",
  message: "Message",
} as const;

export const DEVIS_STATUS_LABELS = {
  new: "Nouveau",
  contacted: "Contacté",
  processed: "Traité",
  archived: "Archivé",
} as const;

export const PREINSCRIPTION_STATUS_LABELS = {
  pending: "En attente",
  validated: "Validée",
  refused: "Refusée",
  archived: "Archivée",
} as const;

export const MESSAGE_STATUS_LABELS = {
  unread: "Non lu",
  answered: "Répondu",
  archived: "Archivé",
} as const;
