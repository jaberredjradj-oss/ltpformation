import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600"
      >
        {label}
        {required && <span className="text-blue-500"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-lead-strong">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

const inputClassName =
  "w-full rounded-2xl border border-slate-200/90 bg-white/90 px-4 py-3.5 text-sm text-navy-950 shadow-[var(--shadow-soft)] outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-300/80 focus:shadow-[0_0_0_4px_rgba(43,127,212,0.08)] disabled:cursor-not-allowed disabled:opacity-60";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
}

export function FormInput({ className, ...props }: FormInputProps) {
  return <input className={cn(inputClassName, className)} {...props} />;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
}

export function FormSelect({ className, children, ...props }: FormSelectProps) {
  return (
    <select className={cn(inputClassName, className)} {...props}>
      {children}
    </select>
  );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
}

export function FormTextarea({ className, ...props }: FormTextareaProps) {
  return (
    <textarea
      className={cn(inputClassName, "min-h-[120px] resize-y", className)}
      {...props}
    />
  );
}
