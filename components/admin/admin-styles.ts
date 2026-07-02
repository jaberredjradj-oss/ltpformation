/** Shared Tailwind classes — admin UI only. */
export const adminStyles = {
  surface: "rounded-lg border border-slate-200 bg-white shadow-sm",
  surfaceMuted: "rounded-lg border border-slate-200 bg-slate-50/80",
  surfaceBlue: "rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-white shadow-sm",
  surfaceGold: "rounded-lg border border-amber-100 bg-gradient-to-br from-amber-50/70 via-white to-white shadow-sm",
  surfaceNavy: "rounded-lg border border-slate-200 bg-gradient-to-br from-slate-100/80 via-white to-blue-50/30 shadow-sm",
  input:
    "w-full min-w-0 rounded-md border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15",
  inputSm:
    "w-full min-w-0 rounded-md border border-slate-200 bg-white text-xs text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15",
  btnSecondary:
    "inline-flex min-h-10 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-8",
  btnPrimary:
    "inline-flex min-h-11 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-9",
  btnAccent:
    "inline-flex min-h-10 shrink-0 items-center justify-center rounded-md border border-blue-200 bg-blue-50 px-3 text-xs font-medium text-blue-800 transition-colors hover:border-blue-300 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-8",
  btnGhost:
    "text-xs font-medium text-slate-600 transition-colors hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50",
  btnDanger:
    "inline-flex min-h-11 items-center justify-center rounded-md bg-red-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-9",
  btnDangerOutline:
    "inline-flex min-h-10 shrink-0 items-center justify-center rounded-md border border-red-200 bg-white px-3 text-xs font-medium text-red-700 transition-colors hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-8",
  label: "text-xs font-medium text-slate-500",
  eyebrow: "text-xs font-medium tracking-wide text-blue-700/80",
  mobileCard: "rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5",
  tableHead: "border-b border-blue-100/80 bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 text-xs font-medium text-slate-600",
  sectionHeader: "border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30 px-5 py-4 md:px-6",
} as const;

export const adminActivityTone = {
  devis: "border-l-amber-400 bg-amber-50/30",
  preinscription: "border-l-blue-500 bg-blue-50/25",
  message: "border-l-emerald-400 bg-emerald-50/25",
} as const;

export const adminActivityBadge = {
  devis: "bg-amber-100 text-amber-800",
  preinscription: "bg-blue-100 text-blue-800",
  message: "bg-emerald-100 text-emerald-800",
} as const;
