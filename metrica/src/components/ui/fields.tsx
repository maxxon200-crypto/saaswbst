import { cn } from "@/lib/cn";

const fieldBase =
  "mt-2 w-full rounded-none border border-line bg-paper px-3 py-2.5 text-body text-ink outline-none transition-colors focus:border-ink";

export function TextField({
  label,
  hint,
  className,
  ...props
}: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="label flex items-center justify-between">
        <span>{label}</span>
        {hint && <span className="normal-case tracking-normal text-stone">{hint}</span>}
      </span>
      <input {...props} className={cn(fieldBase, className)} />
    </label>
  );
}

export function SelectField({
  label,
  className,
  children,
  ...props
}: { label: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <select {...props} className={cn(fieldBase, "appearance-none", className)}>
        {children}
      </select>
    </label>
  );
}
