"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import type { SubmitterRegistrationItem } from "@/lib/services/submitter.service";
import { openSubmitterRegistrationAction } from "@/features/submitter/actions/submitter.actions";
import { EmployeeStatus } from "@/types/enums";
import { useToast } from "@/components/ui/toast";

interface RegistrationsTableProps {
  registrations: SubmitterRegistrationItem[];
  emptyMessage?: string;
  showViewLink?: boolean;
  viewPathPrefix?: string;
  allowSubmitterEdit?: boolean;
}

const EDITABLE = new Set([
  EmployeeStatus.DRAFT,
  EmployeeStatus.SUBMITTED,
  EmployeeStatus.L1_REVIEW,
  EmployeeStatus.L1_RETURNED,
  EmployeeStatus.L2_RETURNED,
]);

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function RegistrationsTable({
  registrations,
  emptyMessage = "No registrations found.",
  showViewLink = false,
  viewPathPrefix,
  allowSubmitterEdit = false,
}: RegistrationsTableProps) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  if (registrations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-white p-12 text-center">
        <p className="text-[#64748B]">{emptyMessage}</p>
      </div>
    );
  }

  function handleEdit(id: string) {
    startTransition(async () => {
      const result = await openSubmitterRegistrationAction(id);
      if (!result.success) {
        toast({
          title: "Unable to open",
          description: result.error,
          variant: "destructive",
        });
        return;
      }
      window.location.assign(result.redirectTo);
    });
  }

  const showActions = showViewLink || allowSubmitterEdit;

  return (
    <div className="ui-card overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Application Ref</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Name</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Post</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Status</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Submitted</th>
              {showActions && (
                <th className="px-4 py-3 text-right font-medium text-[#64748B]">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {registrations.map((row) => (
              <tr
                key={row._id}
                className="border-b border-[#E2E8F0] last:border-0 transition-colors hover:bg-[#F8FAFC]"
              >
                <td className="px-4 py-3 font-medium text-primary">{row.applicationRef}</td>
                <td className="px-4 py-3">{row.fullName}</td>
                <td className="px-4 py-3 text-[#64748B]">{row.postAppliedFor ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      row.temporaryEmployeeId
                        ? "inline-flex max-w-md rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-800"
                        : row.status === EmployeeStatus.L1_RETURNED ||
                            row.status === EmployeeStatus.L2_RETURNED
                          ? "inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800"
                          : "inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                    }
                  >
                    {row.statusLabel}
                  </span>
                  {row.rejectionComment && (
                    <p className="mt-1 max-w-md text-xs text-amber-800">
                      Note: {row.rejectionComment}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-[#64748B]">{formatDate(row.submittedAt)}</td>
                {showActions && (
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-3">
                      <Link
                        href={
                          viewPathPrefix
                            ? `${viewPathPrefix}/${row._id}`
                            : `/dashboard/submitter/registrations/${row._id}`
                        }
                        className="inline-flex items-center gap-1 text-primary transition hover:gap-1.5 hover:underline"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                      {allowSubmitterEdit && EDITABLE.has(row.status) && (
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => handleEdit(row._id)}
                          className="inline-flex items-center gap-1 text-primary transition hover:gap-1.5 hover:underline disabled:opacity-50"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
