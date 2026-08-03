import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div>
      <label
        htmlFor={id}
        className={cn("flex cursor-pointer items-start gap-2", className)}
      >
        <input
          type="checkbox"
          id={id}
          ref={ref}
          className="mt-1 h-4 w-4 rounded border-[#CBD5E1] text-primary focus:ring-primary"
          {...props}
        />
        {label && (
          <span className="text-sm text-[#334155] leading-snug">{label}</span>
        )}
      </label>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
);
Checkbox.displayName = "Checkbox";
