import { cn } from "@/lib/utils";

interface FormCheckboxProps {
  id: string;
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  error?: string;
  className?: string;
}

export function FormCheckbox({
  id,
  name,
  checked,
  onChange,
  children,
  error,
  className,
}: FormCheckboxProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="group flex cursor-pointer items-start gap-3">
        <span className="relative mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center">
          <input
            id={id}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
            className="peer sr-only"
          />
          <span
            className={cn(
              "absolute inset-0 rounded-[5px] border transition-all duration-300",
              "border-slate-200/90 bg-white/90 shadow-[var(--shadow-soft)]",
              "peer-focus-visible:shadow-[0_0_0_4px_rgba(43,127,212,0.08)]",
              "peer-checked:border-blue-500 peer-checked:bg-blue-600",
              error && "border-red-300/80",
            )}
            aria-hidden
          />
          <svg
            viewBox="0 0 12 10"
            className={cn(
              "relative h-2.5 w-2.5 text-white opacity-0 transition-opacity duration-200",
              checked && "opacity-100",
            )}
            aria-hidden
          >
            <path
              d="M1 5.2 4.2 8.4 11 1.4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="text-sm leading-relaxed text-body-strong">{children}</span>
      </label>
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
