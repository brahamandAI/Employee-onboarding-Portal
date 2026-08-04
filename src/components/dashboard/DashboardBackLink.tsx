"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardBackLinkProps {
  href?: string;
  label?: string;
  className?: string;
  /** When true and no href, uses browser history back */
  useHistory?: boolean;
}

export function DashboardBackLink({
  href,
  label = "Back",
  className,
  useHistory = false,
}: DashboardBackLinkProps) {
  const router = useRouter();

  const classes = cn(
    "inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-[#1D4ED8] transition",
    "hover:bg-[#EFF6FF] hover:text-[#1E40AF]",
    className
  );

  if (useHistory || !href) {
    return (
      <button type="button" onClick={() => router.back()} className={classes}>
        <ArrowLeft className="h-4 w-4" />
        {label}
      </button>
    );
  }

  return (
    <Link href={href} className={classes}>
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}
