import { adminStyles } from "@/components/admin/admin-styles";

interface AdminFilterBarProps {
  children: React.ReactNode;
  onReset: () => void;
  summary: React.ReactNode;
}

export function AdminFilterBar({ children, onReset, summary }: AdminFilterBarProps) {
  return (
    <div className={`mb-5 space-y-4 p-4 sm:p-5 ${adminStyles.surface}`}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 [&>*:first-child]:sm:col-span-2 [&>*:first-child]:2xl:col-span-2">
        {children}
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 shrink">{summary}</div>
        <button type="button" onClick={onReset} className={adminStyles.btnGhost}>
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  );
}
