import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <div className="w-full">
      <textarea
        className={cn(
          "flex min-h-[96px] w-full rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-sm text-[#0F172A] shadow-sm placeholder:text-[#94A3B8]",
          "transition focus-visible:border-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/25",
          "disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:opacity-60",
          error && "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-200",
          className
        )}
        ref={ref}
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
Textarea.displayName = "Textarea";
