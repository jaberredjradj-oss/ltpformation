interface AdminResultsSummaryProps {
  count: number;
  total: number;
}

export function AdminResultsSummary({ count, total }: AdminResultsSummaryProps) {
  return (
    <p className="text-xs font-medium tabular-nums text-slate-600">
      {count === total
        ? `${count} résultat${count > 1 ? "s" : ""}`
        : `${count} résultat${count > 1 ? "s" : ""} sur ${total}`}
    </p>
  );
}
