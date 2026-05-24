interface AdminTableGroupHeaderProps {
  label: string;
  count: number;
}

export function AdminTableGroupHeader({ label, count }: AdminTableGroupHeaderProps) {
  return (
    <tr className="bg-slate-50">
      <td colSpan={100} className="px-4 py-2.5 text-xs font-medium text-slate-700">
        {label}
        <span className="ml-2 font-normal tabular-nums text-slate-500">({count})</span>
      </td>
    </tr>
  );
}
