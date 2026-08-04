import { EmployeeStatus } from "@/types/enums";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<EmployeeStatus, string> = {
  [EmployeeStatus.DRAFT]: "Draft",
  [EmployeeStatus.SUBMITTED]: "Pending L1",
  [EmployeeStatus.L1_REVIEW]: "Pending L1",
  [EmployeeStatus.L1_RETURNED]: "Correction Required",
  [EmployeeStatus.L2_REVIEW]: "Pending L2",
  [EmployeeStatus.L2_RETURNED]: "Correction Required",
  [EmployeeStatus.APPROVED]: "L2 Approved",
  [EmployeeStatus.ID_GENERATED]: "Temp ID Generated",
  [EmployeeStatus.ID_CARD_ISSUED]: "Completed",
  [EmployeeStatus.REJECTED]: "Reversed",
};

const STATUS_STYLES: Record<EmployeeStatus, string> = {
  [EmployeeStatus.DRAFT]:
    "bg-slate-100 text-slate-700 border-slate-200 ring-slate-100",
  [EmployeeStatus.SUBMITTED]:
    "bg-blue-50 text-blue-800 border-blue-200 ring-blue-50",
  [EmployeeStatus.L1_REVIEW]:
    "bg-blue-50 text-blue-800 border-blue-200 ring-blue-50",
  [EmployeeStatus.L1_RETURNED]:
    "bg-amber-50 text-amber-900 border-amber-200 ring-amber-50",
  [EmployeeStatus.L2_REVIEW]:
    "bg-sky-50 text-sky-900 border-sky-200 ring-sky-50",
  [EmployeeStatus.L2_RETURNED]:
    "bg-amber-50 text-amber-900 border-amber-200 ring-amber-50",
  [EmployeeStatus.APPROVED]:
    "bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-50",
  [EmployeeStatus.ID_GENERATED]:
    "bg-teal-50 text-teal-800 border-teal-200 ring-teal-50",
  [EmployeeStatus.ID_CARD_ISSUED]:
    "bg-[#0B1F3A]/5 text-[#0B1F3A] border-[#0B1F3A]/15 ring-[#0B1F3A]/5",
  [EmployeeStatus.REJECTED]:
    "bg-red-50 text-red-800 border-red-200 ring-red-50",
};

interface StatusBadgeProps {
  status: EmployeeStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide ring-2 ring-inset",
        STATUS_STYLES[status],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" aria-hidden />
      {STATUS_LABELS[status]}
    </span>
  );
}
