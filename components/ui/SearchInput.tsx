import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Rechercher une formation…",
  className,
  id = "formation-search",
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        Rechercher une formation
      </label>
      <span
        aria-hidden
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-600/70"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      </span>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200/90 bg-white/90 py-3.5 pl-11 pr-4 text-sm text-navy-950 shadow-[var(--shadow-soft)] outline-none backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 focus:border-blue-300/80 focus:shadow-[0_0_0_4px_rgba(43,127,212,0.08)]"
      />
    </div>
  );
}
