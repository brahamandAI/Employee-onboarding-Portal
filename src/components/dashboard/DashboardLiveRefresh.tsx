"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { UserRole } from "@/types/enums";
import type { StaffRole } from "@/types/enums";

interface DashboardLiveRefreshProps {
  role: StaffRole;
  intervalMs?: number;
  className?: string;
}

interface LivePayload {
  fingerprint: string;
  pendingCount: number;
  unreadCount: number;
  role?: StaffRole;
}

function liveUpdateMessage(role: StaffRole): string {
  switch (role) {
    case UserRole.SUBMITTER:
      return "Registration status updated — Temporary Employee ID may be available.";
    case UserRole.L1:
      return "Application queue updated — check pending reviews.";
    case UserRole.L2:
      return "New applications ready for L2 approval.";
    case UserRole.ADMIN:
      return "New L2-approved registrations available.";
    case UserRole.SUPPORT:
      return "New employees forwarded for ID card generation.";
    default:
      return "Queue updated — list refreshed.";
  }
}

export function DashboardLiveRefresh({
  role,
  intervalMs = 3000,
  className,
}: DashboardLiveRefreshProps) {
  const router = useRouter();
  const { toast } = useToast();
  const lastFingerprint = useRef<string | null>(null);
  const isFirstPoll = useRef(true);

  useEffect(() => {
    let active = true;

    async function poll() {
      if (document.hidden) return;

      try {
        const res = await fetch("/api/dashboard/live", { cache: "no-store" });
        if (!res.ok || !active) return;

        const data = (await res.json()) as LivePayload;
        const previous = lastFingerprint.current;
        lastFingerprint.current = data.fingerprint;

        if (isFirstPoll.current) {
          isFirstPoll.current = false;
          return;
        }

        if (previous && previous !== data.fingerprint) {
          router.refresh();
          toast({
            title: "Live update",
            description: liveUpdateMessage(role),
            variant: "success",
          });
        }
      } catch {
        // ignore transient network errors
      }
    }

    poll();
    const interval = setInterval(poll, intervalMs);

    const onVisible = () => {
      if (!document.hidden) poll();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      active = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [router, intervalMs, toast, role]);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-800",
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
      </span>
      <Radio className="h-3.5 w-3.5" />
      Live updates
    </span>
  );
}
