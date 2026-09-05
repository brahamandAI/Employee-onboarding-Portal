"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  ChevronDown,
  KeyRound,
  LogOut,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { staffLogoutAction } from "@/features/auth/actions/auth.actions";
import { getRoleLabel } from "@/lib/auth/permissions";
import { StaffRole } from "@/types/enums";

interface ProfileMenuProps {
  userName: string;
  userEmail?: string;
  role: StaffRole;
  profileHref: string;
}

export function ProfileMenu({
  userName,
  userEmail,
  role,
  profileHref,
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleSignOut() {
    if (isSigningOut) return;
    setIsSigningOut(true);
    startTransition(async () => {
      try {
        await staffLogoutAction();
      } finally {
        window.location.replace("/staff/login");
      }
    });
  }

  const initials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        suppressHydrationWarning
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "group flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white py-1 pl-1 pr-2.5 shadow-sm transition",
          "hover:border-sky-200 hover:shadow-[0_8px_24px_-16px_rgba(14,165,233,0.55)]",
          open && "border-sky-300 ring-2 ring-sky-400/25"
        )}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#0B1F3A] to-[#1D4ED8] text-xs font-semibold text-white">
          {initials || <UserRound className="h-4 w-4" />}
        </span>
        <span className="hidden min-w-0 text-left sm:block">
          <span className="block max-w-[140px] truncate text-xs font-semibold text-primary">
            {userName}
          </span>
          <span className="block max-w-[140px] truncate text-[10px] text-[#64748B]">
            {getRoleLabel(role)}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-[#94A3B8] transition",
            open && "rotate-180 text-primary"
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-[60] mt-2 w-64 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_24px_60px_-28px_rgba(11,31,58,0.45)]"
        >
          <div className="border-b border-[#E2E8F0] bg-gradient-to-br from-[#F8FAFC] to-white px-4 py-3">
            <p className="truncate text-sm font-semibold text-primary">{userName}</p>
            {userEmail && (
              <p className="mt-0.5 truncate text-xs text-[#64748B]">{userEmail}</p>
            )}
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-[#94A3B8]">
              {getRoleLabel(role)}
            </p>
          </div>
          <div className="p-1.5">
            <Link
              href={profileHref}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#0F172A] transition hover:bg-[#EFF6FF]"
            >
              <UserRound className="h-4 w-4 text-[#1D4ED8]" />
              View profile
            </Link>
            <Link
              href={`${profileHref}#change-password`}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#0F172A] transition hover:bg-[#EFF6FF]"
            >
              <KeyRound className="h-4 w-4 text-[#0F766E]" />
              Change password
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#B91C1C] transition hover:bg-red-50 disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              {isSigningOut ? "Signing out…" : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
