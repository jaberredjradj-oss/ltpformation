import { adminStyles } from "@/components/admin/admin-styles";

interface AdminEmptyStateProps {
  title: string;
  description: string;
}

export function AdminEmptyState({ title, description }: AdminEmptyStateProps) {
  return (
    <div
      className={`px-6 py-14 text-center ${adminStyles.surfaceMuted} border-dashed`}
    >
      <p className="text-base font-semibold text-slate-900">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{description}</p>
    </div>
  );
}
