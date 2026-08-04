"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  ChevronUp,
  KeyRound,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { staffLogoutAction } from "@/features/auth/actions/auth.actions";
import { getRoleLabel } from "@/lib/auth/permissions";
import { StaffRole } from "@/types/enums";

interface SidebarUserCardProps {
  userName: string;
  userEmail?: string;
  role: StaffRole;
  profileHref: string;
  collapsed?: boolean;
}

export function SidebarUserCard({
  userName,
  userEmail,
  role,
  profileHref,
  collapsed = false,
}: SidebarUserCardProps) {
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
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute z-[70] mb-2 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1F3A] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)]",
            collapsed
              ? "bottom-full left-1/2 w-56 -translate-x-1/2"
              : "bottom-full left-0 right-0"
          )}
        >
          <div className="border-b border-white/10 px-3.5 py-3">
            <p className="truncate text-sm font-semibold text-white">{userName}</p>
            {userEmail && (
              <p className="mt-0.5 truncate text-xs text-white/50">{userEmail}</p>
            )}
          </div>
          <div className="p-1.5">
            <Link
              href={profileHref}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              <UserRound className="h-4 w-4 text-sky-300" />
              Profile
            </Link>
            <Link
              href={`${profileHref}#change-password`}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              <Settings className="h-4 w-4 text-accent" />
              Settings
            </Link>
            <Link
              href={`${profileHref}#change-password`}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              <KeyRound className="h-4 w-4 text-teal-300" />
              Change password
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-red-300 transition hover:bg-red-500/15 hover:text-red-200 disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              {isSigningOut ? "Signing out…" : "Logout"}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        title={collapsed ? userName : undefined}
        className={cn(
          "flex w-full items-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_8px_24px_-16px_rgba(0,0,0,0.5)] transition",
          "hover:border-white/20 hover:bg-white/[0.1]",
          open && "border-accent/35 bg-white/[0.12]",
          collapsed ? "justify-center p-2" : "gap-3 px-3 py-2.5"
        )}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#0B1F3A] text-xs font-bold text-white ring-2 ring-white/10">
          {initials || <UserRound className="h-4 w-4" />}
        </span>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-semibold text-white">
                {userName}
              </span>
              <span className="block truncate text-[11px] text-white/50">
                {getRoleLabel(role)}
              </span>
            </span>
            <ChevronUp
              className={cn(
                "h-4 w-4 shrink-0 text-white/40 transition",
                open ? "rotate-0 text-accent" : "rotate-180"
              )}
            />
          </>
        )}
      </button>
    </div>
  );
}
