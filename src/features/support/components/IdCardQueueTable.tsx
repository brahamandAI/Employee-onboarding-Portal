import Link from "next/link";
import { IdCardQueueItem } from "@/lib/services/support.service";
import { StatusBadge } from "@/features/l1/components/StatusBadge";
import {
  Eye,
  FileOutput,
  Download,
  Printer,
  CheckCircle,
} from "lucide-react";

interface IdCardQueueTableProps {
  items: IdCardQueueItem[];
  emptyMessage?: string;
  showCompleted?: boolean;
  actionPathPrefix?: string;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function cardStatusLabel(item: IdCardQueueItem): string {
  if (item.completedAt || item.cardStatus === "COMPLETED") return "Completed";
  if (item.hasDraftCard || item.cardStatus === "GENERATED") return "Generated";
  return "L2 Approved";
}

export function IdCardQueueTable({
  items,
  emptyMessage = "No records found.",
  showCompleted = false,
  actionPathPrefix = "/dashboard/support/id-cards/generate",
}: IdCardQueueTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-white p-12 text-center">
        <p className="text-[#64748B]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">
                Employee Number
              </th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">
                Employee Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Photo</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">
                Designation
              </th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">
                Department
              </th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Branch</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Status</th>
              <th className="px-4 py-3 text-right font-medium text-[#64748B]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item._id}
                className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC]"
              >
                <td className="px-4 py-3 font-mono font-medium text-primary">
                  {item.employeeIdCode}
                </td>
                <td className="px-4 py-3 font-medium">{item.fullName}</td>
                <td className="px-4 py-3">
                  {item.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.photoUrl}
                      alt={item.fullName}
                      className="h-10 w-10 rounded-md border border-[#E2E8F0] object-cover"
                    />
                  ) : (
                    <span className="text-xs text-[#94A3B8]">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-[#64748B]">
                  {item.designation ?? item.postAppliedFor ?? "—"}
                </td>
                <td className="px-4 py-3 text-[#64748B]">{item.department ?? "—"}</td>
                <td className="px-4 py-3 text-[#64748B]">{item.branch ?? "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <StatusBadge status={item.status} />
                    <span className="text-xs text-[#64748B]">{cardStatusLabel(item)}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-1">
                    <ActionLink
                      href={`${actionPathPrefix}/${item._id}`}
                      icon={item.hasDraftCard ? Eye : FileOutput}
                      label={item.hasDraftCard ? "Preview" : "Generate ID Card"}
                    />
                    {item.idCardId && (
                      <>
                        <ActionLink
                          href={`/api/id-cards/${item.idCardId}/download`}
                          icon={Download}
                          label="Download PDF"
                          external
                        />
                        <ActionLink
                          href={`/api/id-cards/${item.idCardId}/download?log=false`}
                          icon={Printer}
                          label="Print"
                          external
                          target="_blank"
                        />
                      </>
                    )}
                    {item.completedAt && (
                      <span className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs text-green-700">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Done {formatDate(item.completedAt)}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionLink({
  href,
  icon: Icon,
  label,
  external,
  target,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  external?: boolean;
  target?: string;
}) {
  return (
    <Link
      href={href}
      target={target ?? (external ? "_blank" : undefined)}
      rel={external ? "noopener noreferrer" : undefined}
      className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-primary hover:bg-muted"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Link>
  );
}
