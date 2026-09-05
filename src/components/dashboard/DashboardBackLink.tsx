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
    "inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-semibold text-[#1D4ED8] shadow-sm transition",
    "hover:border-sky-200 hover:bg-[#EFF6FF] hover:text-[#1E40AF]",
    className
  );

  const content = (
    <>
      <ArrowLeft className="h-4 w-4" aria-hidden />
      {label}
    </>
  );

  function goBack() {
    const fromSameApp =
      typeof document !== "undefined" &&
      document.referrer.startsWith(window.location.origin);
    if (fromSameApp || useHistory || !href) {
      router.back();
      return;
    }
    router.push(href);
  }

  if (useHistory || !href) {
    return (
      <button type="button" onClick={goBack} className={classes}>
        {content}
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={classes}
      onClick={(e) => {
        if (document.referrer.startsWith(window.location.origin)) {
          e.preventDefault();
          router.back();
        }
      }}
    >
      {content}
    </Link>
  );
}
