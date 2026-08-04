import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, placeholder, options, ...props }, ref) => (
    <div className="w-full">
      <select
        className={cn(
          "flex h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-sm text-[#0F172A] shadow-sm",
          "transition focus-visible:border-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/25",
          "disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:opacity-60",
          error && "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-200",
          className
        )}
        ref={ref}
        suppressHydrationWarning
        aria-invalid={error ? true : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
);
Select.displayName = "Select";
