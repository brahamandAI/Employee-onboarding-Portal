"use client";

import { CheckCircle2, Circle, Clock3, Undo2, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ApprovalTimelineItem {
  action: string;
  fromStatus: string;
  toStatus: string;
  comment?: string;
  createdAt: string | Date;
  performedBy?: { name?: string };
  performedByRole?: string;
}

const ACTION_META: Record<
  string,
  { label: string; tone: "blue" | "green" | "amber" | "purple" | "slate" }
> = {
  SUBMIT: { label: "Submitted by Registration Submitter", tone: "blue" },
  RESUBMIT: { label: "Updated & Resubmitted", tone: "blue" },
  L1_APPROVE: { label: "Approved by L1 Approver", tone: "green" },
  L1_RETURN: { label: "Reversed by L1 Approver", tone: "amber" },
  L1_REJECT: { label: "Reversed by L1 Approver", tone: "amber" },
  L2_APPROVE: { label: "Approved by L2 Approver", tone: "green" },
  L2_RETURN: { label: "Reversed by L2 Approver", tone: "amber" },
  L2_RETURN_TO_L1: { label: "Sent back to L1 by L2 Approver", tone: "amber" },
  L2_REJECT: { label: "Reversed by L2 Approver", tone: "amber" },
  L2_FORWARD: { label: "Forwarded by L2 Approver", tone: "purple" },
  L2_FORWARD_ADMIN: { label: "Sent to Admin", tone: "purple" },
  GENERATE_ID: { label: "Temporary Employee ID Generated", tone: "green" },
};

const TONE_CLASSES = {
  blue: "border-blue-200 bg-blue-50 text-blue-800",
  green: "border-green-200 bg-green-50 text-green-800",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  purple: "border-purple-200 bg-purple-50 text-purple-800",
  slate: "border-slate-200 bg-slate-50 text-slate-700",
};

function formatWhen(value: string | Date) {
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ApprovalStatusTimeline({
  history,
  currentStatus,
}: {
  history: ApprovalTimelineItem[];
  currentStatus?: string;
}) {
  const items = [...history].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="ui-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-gradient-to-r from-[#EFF6FF] to-white px-4 py-3 sm:px-5">
        <div>
          <h3 className="font-heading text-base font-semibold text-[#0F172A]">
            Approval Status
          </h3>
          <p className="text-xs text-[#64748B]">
            Live timeline of who approved and when
          </p>
        </div>
        {currentStatus && (
          <span className="rounded-full border border-blue-200 bg-white px-2.5 py-1 text-xs font-medium text-blue-700">
            {currentStatus.replace(/_/g, " ")}
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5">
        {items.length === 0 ? (
          <p className="text-sm text-[#64748B]">No approval activity yet.</p>
        ) : (
          <ol className="relative space-y-4 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-[#E2E8F0]">
            {items.map((item, index) => {
              const meta = ACTION_META[item.action] ?? {
                label: item.action.replace(/_/g, " "),
                tone: "slate" as const,
              };
              const isLatest = index === items.length - 1;
              const Icon =
                item.action.includes("RETURN") || item.action.includes("REJECT")
                  ? Undo2
                  : item.action.includes("APPROVE") || item.action === "GENERATE_ID"
                    ? CheckCircle2
                    : item.action.includes("SUBMIT")
                      ? UserCheck
                      : Clock3;

              return (
                <li key={`${item.action}-${index}`} className="relative pl-10">
                  <span
                    className={cn(
                      "absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-sm",
                      isLatest ? "border-green-300 text-green-700" : "border-[#E2E8F0] text-[#64748B]"
                    )}
                  >
                    {isLatest ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Circle className="h-3.5 w-3.5" />
                    )}
                  </span>
                  <div
                    className={cn(
                      "rounded-xl border px-3 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                      TONE_CLASSES[meta.tone]
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 shrink-0" />
                        <p className="text-sm font-semibold">{meta.label}</p>
                      </div>
                      <time className="text-[11px] opacity-80">{formatWhen(item.createdAt)}</time>
                    </div>
                    <p className="mt-1 text-xs opacity-90">
                      {item.performedBy?.name
                        ? `${item.performedBy.name}`
                        : "System"}
                      {item.performedByRole ? ` · ${item.performedByRole}` : ""}
                    </p>
                    <p className="mt-1 text-[11px] opacity-75">
                      {item.fromStatus.replace(/_/g, " ")} → {item.toStatus.replace(/_/g, " ")}
                    </p>
                    {item.comment && (
                      <p className="mt-2 rounded-lg bg-white/70 px-2.5 py-1.5 text-xs">
                        Note: {item.comment}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
