"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Eye,
  IdCard,
  Printer,
  Radio,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ApplicationStatusData } from "@/features/application-status/constants";
import { NotificationViewModel } from "@/features/notifications/constants";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

interface LiveStatusPayload extends ApplicationStatusData {
  statusLabel: string;
  approvalStage: string;
  notifications: NotificationViewModel[];
  updatedAt: string;
}

interface RegistrationStatusPanelProps {
  initialData: LiveStatusPayload;
  pollIntervalMs?: number;
}

export function RegistrationStatusPanel({
  initialData,
  pollIntervalMs = 5000,
}: RegistrationStatusPanelProps) {
  const { toast } = useToast();
  const [data, setData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(initialData.updatedAt);
  const previousStatus = useRef(initialData.status);
  const previousEmployeeId = useRef(initialData.employeeId);

  const fetchStatus = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const res = await fetch("/api/employee/status", { cache: "no-store" });
      if (!res.ok) return;
      const next: LiveStatusPayload = await res.json();

      if (previousStatus.current !== next.status) {
        toast({
          title: "Status updated",
          description: next.statusLabel,
          variant: "success",
        });
        previousStatus.current = next.status;
      }

      if (!previousEmployeeId.current && next.employeeId) {
        toast({
          title: "Employee ID assigned",
          description: `Your employee number is ${next.employeeId}.`,
          variant: "success",
        });
        previousEmployeeId.current = next.employeeId;
      }

      setData(next);
      setLastUpdated(next.updatedAt);
    } catch {
      // ignore transient network errors during polling
    } finally {
      setIsRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    const interval = setInterval(() => fetchStatus(true), pollIntervalMs);
    return () => clearInterval(interval);
  }, [fetchStatus, pollIntervalMs]);

  const showEmployeeId = Boolean(data.employeeId);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold text-green-900">
                  Registration Successful
                </h1>
                <p className="mt-1 text-sm text-green-800">
                  Your employment application has been submitted. Track real-time approval updates
                  below.
                </p>
                <p className="mt-2 font-mono text-xs text-green-700">
                  Ref: {data.applicationRef}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-green-800">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
              </span>
              <Radio className="h-3.5 w-3.5" />
              Live updates
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard
          label="Application Status"
          value={data.statusLabel}
          highlight
          className="md:col-span-2"
        />
        <StatusCard label="Current Stage" value={data.approvalStage} />
      </div>

      {showEmployeeId && (
        <Card className="border-[#BFDBFE] bg-gradient-to-r from-[#EFF6FF] to-white shadow-md">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1D4ED8] text-white">
                <IdCard className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Employee Number
                </p>
                <p className="font-mono text-2xl font-bold text-[#1D4ED8]">{data.employeeId}</p>
                <p className="mt-0.5 text-xs text-[#64748B]">
                  Assigned after L1 approval
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {(data.displayStatus === "CORRECTION_REQUIRED" || data.displayStatus === "REJECTED") && (
        <Card
          className={cn(
            "shadow-sm",
            data.displayStatus === "REJECTED"
              ? "border-red-200 bg-red-50"
              : "border-amber-200 bg-amber-50"
          )}
        >
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              {data.displayStatus === "REJECTED" ? (
                <XCircle className="h-6 w-6 shrink-0 text-red-600" />
              ) : (
                <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600" />
              )}
              <div>
                <p className="font-semibold text-[#1E293B]">
                  {data.displayStatus === "REJECTED" ? "Comments" : "Correction Required"}
                </p>
                <p className="mt-1 text-sm text-[#475569]">
                  {data.rejectionReason ??
                    data.correctionNotes ??
                    "Please review the feedback and update your application."}
                </p>
              </div>
            </div>
            {data.editUrl && data.displayStatus === "CORRECTION_REQUIRED" && (
              <Link href={data.editUrl}>
                <Button>Edit Application</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {data.idCard && (
        <Card className="border-[#BFDBFE] shadow-md">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-heading text-lg font-semibold text-[#1D4ED8]">
                ID Card Generated
              </p>
              <p className="text-sm text-[#64748B]">
                Generated on{" "}
                {new Date(data.idCard.generatedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={data.idCard.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <Eye className="h-4 w-4" />
                  View ID Card
                </Button>
              </a>
              <a href={data.idCard.url} target="_blank" rel="noopener noreferrer" download>
                <Button className="gap-2 bg-gradient-to-r from-[#1D4ED8] to-[#2563EB]">
                  <Download className="h-4 w-4" />
                  Download ID Card
                </Button>
              </a>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => window.open(data.idCard!.url, "_blank")}
              >
                <Printer className="h-4 w-4" />
                Print ID Card
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {data.notifications.length > 0 && (
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-[#1E3A8A]">
                Recent Updates
              </h2>
              <button
                type="button"
                onClick={() => fetchStatus()}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2563EB] hover:underline"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
                Refresh
              </button>
            </div>
            <ul className="space-y-3">
              {data.notifications.map((n) => (
                <li
                  key={n._id}
                  className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3"
                >
                  <p className="text-sm font-semibold text-[#1E293B]">{n.title}</p>
                  <p className="mt-0.5 text-sm text-[#64748B]">{n.body}</p>
                  <p className="mt-1 text-[10px] text-[#94A3B8]">
                    {new Date(n.createdAt).toLocaleString("en-IN")}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[10px] text-[#94A3B8]">
              Last synced: {new Date(lastUpdated).toLocaleTimeString("en-IN")}
            </p>
          </CardContent>
        </Card>
      )}

      <p className="text-center text-[10px] text-[#94A3B8]">
        Status refreshes automatically every {pollIntervalMs / 1000} seconds · Last synced:{" "}
        {new Date(lastUpdated).toLocaleTimeString("en-IN")}
      </p>
    </div>
  );
}

function StatusCard({
  label,
  value,
  highlight,
  className,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <Card className={cn("shadow-sm", highlight && "border-[#BFDBFE]", className)}>
      <CardContent className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">{label}</p>
        <p
          className={cn(
            "mt-2 font-heading font-bold",
            highlight ? "text-xl text-[#1D4ED8]" : "text-lg text-[#1E293B]"
          )}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
