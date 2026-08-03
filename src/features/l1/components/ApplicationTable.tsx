import Link from "next/link";
import { Eye } from "lucide-react";
import { ApplicationListItem } from "@/lib/services/l1.service";
import { StatusBadge } from "@/features/l1/components/StatusBadge";

interface ApplicationTableProps {
  applications: ApplicationListItem[];
  emptyMessage?: string;
  showEmployeeId?: boolean;
  viewPathPrefix?: string;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ApplicationTable({
  applications,
  emptyMessage = "No applications found.",
  showEmployeeId = false,
  viewPathPrefix = "/dashboard/l1/applications",
}: ApplicationTableProps) {
  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white/80 p-12 text-center">
        <p className="text-sm text-[#64748B]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]/90">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Application Ref
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Name
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Post
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Submitted By
              </th>
              {showEmployeeId && (
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                  Employee ID
                </th>
              )}
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Submitted
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr
                key={app._id}
                className="border-b border-[#E2E8F0] last:border-0 transition-colors hover:bg-[#F8FAFC]"
              >
                <td className="px-4 py-3 font-medium text-primary">
                  {app.applicationRef}
                </td>
                <td className="px-4 py-3 font-medium text-[#0F172A]">{app.fullName}</td>
                <td className="px-4 py-3 text-[#64748B]">
                  {app.postAppliedFor ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-4 py-3 text-[#64748B]">
                  {app.submittedByName ?? "—"}
                </td>
                {showEmployeeId && (
                  <td className="px-4 py-3 font-mono text-sm">
                    {app.employeeId ?? "—"}
                  </td>
                )}
                <td className="px-4 py-3 text-[#64748B]">
                  {formatDate(app.submittedAt ?? app.l1ApprovedAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`${viewPathPrefix}/${app._id}`}
                    className="inline-flex h-8 items-center gap-1 rounded-lg px-3 text-sm font-medium text-[#1D4ED8] transition hover:bg-[#EFF6FF]"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
