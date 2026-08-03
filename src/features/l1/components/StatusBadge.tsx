import { EmployeeStatus } from "@/types/enums";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<EmployeeStatus, string> = {
  [EmployeeStatus.DRAFT]: "Draft",
  [EmployeeStatus.SUBMITTED]: "Pending L1 Approval",
  [EmployeeStatus.L1_REVIEW]: "Pending L1 Approval",
  [EmployeeStatus.L1_RETURNED]: "Correction Required",
  [EmployeeStatus.L2_REVIEW]: "Pending L2 Approval",
  [EmployeeStatus.L2_RETURNED]: "Correction Required",
  [EmployeeStatus.APPROVED]: "L2 Approved",
  [EmployeeStatus.ID_GENERATED]: "Sent to Admin",
  [EmployeeStatus.ID_CARD_ISSUED]: "Completed",
  [EmployeeStatus.REJECTED]: "Reversed",
};

const STATUS_STYLES: Record<EmployeeStatus, string> = {
  [EmployeeStatus.DRAFT]: "bg-gray-100 text-gray-700 border-gray-200",
  [EmployeeStatus.SUBMITTED]: "bg-blue-100 text-blue-800 border-blue-200",
  [EmployeeStatus.L1_REVIEW]: "bg-blue-100 text-blue-800 border-blue-200",
  [EmployeeStatus.L1_RETURNED]: "bg-amber-100 text-amber-800 border-amber-200",
  [EmployeeStatus.L2_REVIEW]: "bg-sky-100 text-sky-900 border-sky-200",
  [EmployeeStatus.L2_RETURNED]: "bg-amber-100 text-amber-800 border-amber-200",
  [EmployeeStatus.APPROVED]: "bg-emerald-100 text-emerald-800 border-emerald-200",
  [EmployeeStatus.ID_GENERATED]: "bg-emerald-100 text-emerald-800 border-emerald-200",
  [EmployeeStatus.ID_CARD_ISSUED]: "bg-[#0B1F3A]/10 text-[#0B1F3A] border-[#0B1F3A]/15",
  [EmployeeStatus.REJECTED]: "bg-red-100 text-red-800 border-red-200",
};

interface StatusBadgeProps {
  status: EmployeeStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
