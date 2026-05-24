export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-6">
        <div className="h-3 w-24 rounded bg-slate-200" />
        <div className="mt-3 h-7 w-48 rounded bg-slate-200" />
        <div className="mt-3 h-4 w-full max-w-lg rounded bg-slate-100" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="h-3 w-28 rounded bg-slate-100" />
            <div className="mt-3 h-8 w-16 rounded bg-slate-200" />
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="h-10 rounded-md bg-slate-100" />
          <div className="h-10 rounded-md bg-slate-100" />
          <div className="h-10 rounded-md bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
