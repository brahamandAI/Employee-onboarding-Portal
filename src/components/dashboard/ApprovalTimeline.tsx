import { EmployeeStatus } from "@/types/enums";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  CircleDashed,
  Clock3,
  ShieldCheck,
  XCircle,
} from "lucide-react";

interface ApprovalTimelineProps {
  status: EmployeeStatus;
  className?: string;
}

type Stage = {
  key: string;
  label: string;
  isDone: (s: EmployeeStatus) => boolean;
  isCurrent: (s: EmployeeStatus) => boolean;
};

const STAGES: Stage[] = [
  {
    key: "submitted",
    label: "Registration Submitted",
    isDone: (s) => s !== EmployeeStatus.DRAFT,
    isCurrent: (s) => s === EmployeeStatus.DRAFT,
  },
  {
    key: "l1",
    label: "Pending L1",
    isDone: (s) =>
      [
        EmployeeStatus.L2_REVIEW,
        EmployeeStatus.L2_RETURNED,
        EmployeeStatus.APPROVED,
        EmployeeStatus.ID_GENERATED,
        EmployeeStatus.ID_CARD_ISSUED,
      ].includes(s),
    isCurrent: (s) =>
      [EmployeeStatus.SUBMITTED, EmployeeStatus.L1_REVIEW, EmployeeStatus.L1_RETURNED].includes(
        s
      ),
  },
  {
    key: "l1ok",
    label: "L1 Approved",
    isDone: (s) =>
      [
        EmployeeStatus.L2_REVIEW,
        EmployeeStatus.L2_RETURNED,
        EmployeeStatus.APPROVED,
        EmployeeStatus.ID_GENERATED,
        EmployeeStatus.ID_CARD_ISSUED,
      ].includes(s),
    isCurrent: () => false,
  },
  {
    key: "l2",
    label: "Pending L2",
    isDone: (s) =>
      [
        EmployeeStatus.APPROVED,
        EmployeeStatus.ID_GENERATED,
        EmployeeStatus.ID_CARD_ISSUED,
      ].includes(s),
    isCurrent: (s) =>
      [EmployeeStatus.L2_REVIEW, EmployeeStatus.L2_RETURNED].includes(s),
  },
  {
    key: "l2ok",
    label: "L2 Approved",
    isDone: (s) =>
      [
        EmployeeStatus.APPROVED,
        EmployeeStatus.ID_GENERATED,
        EmployeeStatus.ID_CARD_ISSUED,
      ].includes(s),
    isCurrent: () => false,
  },
  {
    key: "tempId",
    label: "Temporary ID Generated",
    isDone: (s) =>
      [EmployeeStatus.ID_GENERATED, EmployeeStatus.ID_CARD_ISSUED].includes(s),
    isCurrent: (s) => s === EmployeeStatus.APPROVED,
  },
  {
    key: "admin",
    label: "Available for Admin",
    isDone: (s) =>
      [EmployeeStatus.ID_GENERATED, EmployeeStatus.ID_CARD_ISSUED].includes(s),
    isCurrent: () => false,
  },
  {
    key: "support",
    label: "Available for Support",
    isDone: (s) => s === EmployeeStatus.ID_CARD_ISSUED,
    isCurrent: (s) => s === EmployeeStatus.ID_GENERATED,
  },
];

function stageState(
  status: EmployeeStatus,
  stage: Stage
): "done" | "current" | "upcoming" {
  if (stage.isCurrent(status)) return "current";
  if (stage.isDone(status)) return "done";
  return "upcoming";
}

export function ApprovalTimeline({ status, className }: ApprovalTimelineProps) {
  if (status === EmployeeStatus.REJECTED) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <p className="pt-1.5 text-sm font-medium text-emerald-800">
            Registration Submitted
          </p>
        </div>
        <div className="flex gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600">
            <XCircle className="h-4 w-4" />
          </span>
          <div className="pt-1">
            <p className="text-sm font-medium text-red-700">Reversed</p>
            <p className="text-xs text-red-500">Application was reversed for correction</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ol className={cn("space-y-0", className)}>
      {STAGES.map((stage, idx) => {
        const state = stageState(status, stage);
        const Icon =
          state === "done" ? CheckCircle2 : state === "current" ? Clock3 : CircleDashed;

        return (
          <li key={stage.key} className="relative flex gap-3 pb-5 last:pb-0">
            {idx < STAGES.length - 1 && (
              <span
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-20px)] w-0.5",
                  state === "done" ? "bg-emerald-300" : "bg-[#E2E8F0]"
                )}
              />
            )}
            <span
              className={cn(
                "relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                state === "done" && "border-emerald-200 bg-emerald-50 text-emerald-700",
                state === "current" &&
                  "border-sky-300 bg-sky-50 text-sky-700 ring-4 ring-sky-100",
                state === "upcoming" && "border-[#E2E8F0] bg-white text-[#94A3B8]"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 pt-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  state === "current" && "text-sky-800",
                  state === "done" && "text-emerald-800",
                  state === "upcoming" && "text-[#64748B]"
                )}
              >
                {stage.label}
              </p>
              {state === "current" && (
                <p className="mt-0.5 text-xs text-sky-600">Current stage</p>
              )}
            </div>
          </li>
        );
      })}
      {status === EmployeeStatus.ID_CARD_ISSUED && (
        <li className="flex gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <p className="pt-1.5 text-sm font-medium text-emerald-800">Completed</p>
        </li>
      )}
    </ol>
  );
}
