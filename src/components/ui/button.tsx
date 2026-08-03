"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "destructive" | "ghost" | "outline" | "accent";
  size?: "default" | "sm" | "lg";
  isLoading?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-primary text-white hover:bg-primary-hover",
  accent: "bg-accent text-primary hover:bg-accent/90",
  secondary: "bg-white text-primary border border-border hover:bg-muted",
  destructive: "bg-red-700 text-white hover:bg-red-800",
  ghost: "hover:bg-muted text-primary",
  outline: "border border-primary text-primary hover:bg-primary/5",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-8 px-3 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      isLoading,
      disabled,
      children,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button";
