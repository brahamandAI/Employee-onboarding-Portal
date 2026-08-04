import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => (
    <div className="w-full">
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-sm text-[#0F172A] shadow-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#94A3B8]",
          "transition focus-visible:border-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/25",
          "disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:opacity-60",
          error && "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-200",
          className
        )}
        ref={ref}
        suppressHydrationWarning
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
);
Input.displayName = "Input";
