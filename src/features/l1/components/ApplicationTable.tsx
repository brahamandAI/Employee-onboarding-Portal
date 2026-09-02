import Link from "next/link";
import { Eye } from "lucide-react";
import { ApplicationListItem } from "@/lib/services/l1.service";
import { StatusBadge } from "@/features/l1/components/StatusBadge";
import { EmptyState } from "@/components/ui/empty-state";

interface ApplicationTableProps {
  applications: ApplicationListItem[];
  emptyMessage?: string;
  emptyDescription?: string;
  showEmployeeId?: boolean;
  /** Replaces the Submitted By column with the note L2 left when reversing */
  showL2ReverseNote?: boolean;
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
  emptyDescription = "New registrations will appear here when they enter your queue.",
  showEmployeeId = false,
  showL2ReverseNote = false,

  viewPathPrefix = "/dashboard/l1/applications",
}: ApplicationTableProps) {
  if (applications.length === 0) {
    return <EmptyState title={emptyMessage} description={emptyDescription} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-[1]">
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
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
                {showL2ReverseNote ? "L2 Reverse Note" : "Submitted By"}
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
                <td className="px-4 py-3.5 font-medium text-primary">
                  {app.applicationRef}
                </td>
                <td className="px-4 py-3.5 font-medium text-[#0F172A]">{app.fullName}</td>
                <td className="px-4 py-3.5 text-[#64748B]">
                  {app.postAppliedFor ?? "—"}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={app.status} />
                </td>
                {showL2ReverseNote ? (
                  <td className="max-w-[22rem] px-4 py-3.5 text-[#64748B]">
                    {app.l2ReverseNote ? (
                      <>
                        <span className="block whitespace-pre-line text-[#334155]">
                          {app.l2ReverseNote}
                        </span>
                        {(app.l2ReversedByName || app.l2ReversedAt) && (
                          <span className="mt-1 block text-xs text-[#94A3B8]">
                            {app.l2ReversedByName ?? "L2"}
                            {app.l2ReversedAt
                              ? ` · ${formatDate(app.l2ReversedAt)}`
                              : ""}
                          </span>
                        )}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                ) : (
                  <td className="px-4 py-3.5 text-[#64748B]">
                    {app.submittedByName ?? "—"}
                  </td>
                )}
                {showEmployeeId && (
                  <td className="px-4 py-3.5 font-mono text-sm">
                    {app.employeeId ?? "—"}
                  </td>
                )}
                <td className="px-4 py-3.5 text-[#64748B]">
                  {formatDate(app.submittedAt ?? app.l1ApprovedAt)}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <Link
                    href={`${viewPathPrefix}/${app._id}`}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-transparent px-3 text-sm font-medium text-[#1D4ED8] transition hover:border-[#BFDBFE] hover:bg-[#EFF6FF]"
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


