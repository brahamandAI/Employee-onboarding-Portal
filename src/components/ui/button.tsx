"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "ghost"
    | "outline"
    | "accent"
    | "sky"
    | "teal"
    | "success"
    | "warning"
    | "back";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-gradient-to-b from-[#12325C] to-[#0B1F3A] text-white shadow-sm hover:from-[#1A3F70] hover:to-[#0F2748] hover:shadow-md",
  accent:
    "bg-gradient-to-b from-[#E4C65A] to-[#D4AF37] text-[#0B1F3A] shadow-sm hover:from-[#EDD06E] hover:to-[#C9A227] hover:shadow-md",
  sky:
    "bg-gradient-to-b from-[#38BDF8] to-[#0284C7] text-white shadow-sm hover:from-[#7DD3FC] hover:to-[#0369A1] hover:shadow-md",
  teal:
    "bg-gradient-to-b from-[#14B8A6] to-[#0F766E] text-white shadow-sm hover:from-[#2DD4BF] hover:to-[#115E59] hover:shadow-md",
  success:
    "bg-gradient-to-b from-[#22C55E] to-[#15803D] text-white shadow-sm hover:from-[#4ADE80] hover:to-[#166534] hover:shadow-md",
  warning:
    "bg-gradient-to-b from-[#FBBF24] to-[#D97706] text-white shadow-sm hover:from-[#FCD34D] hover:to-[#B45309] hover:shadow-md",
  secondary:
    "bg-white text-primary border border-[#E2E8F0] shadow-sm hover:border-sky-200 hover:bg-[#F8FAFC] hover:shadow",
  destructive:
    "bg-gradient-to-b from-[#EF4444] to-[#B91C1C] text-white shadow-sm hover:from-[#F87171] hover:to-[#991B1B] hover:shadow-md",
  ghost: "hover:bg-[#EFF6FF] text-primary",
  outline:
    "border border-[#0B1F3A]/20 text-primary bg-white hover:border-[#0B1F3A]/40 hover:bg-[#F8FAFC]",
  back: "border border-[#E2E8F0] bg-white text-[#1D4ED8] shadow-sm hover:border-sky-200 hover:bg-[#EFF6FF]",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3.5 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10 p-0",
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
      suppressHydrationWarning
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold leading-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
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
