import { AuditLogItem } from "@/lib/services/audit.service";
import { getRoleLabel } from "@/lib/auth/permissions";
import { StaffRole } from "@/types/enums";

interface AuditLogsTableProps {
  logs: AuditLogItem[];
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function AuditLogsTable({ logs }: AuditLogsTableProps) {
  if (logs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-white p-12 text-center">
        <p className="text-[#64748B]">No audit logs recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Timestamp</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Action</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Entity</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Performed By</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-b border-[#E2E8F0] last:border-0">
                <td className="whitespace-nowrap px-4 py-3 text-[#64748B]">{formatDateTime(log.createdAt)}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3">{log.entity}{log.entityId ? ` · ${log.entityId.slice(-6)}` : ""}</td>
                <td className="px-4 py-3">
                  <div>{log.performedByName}</div>
                  <div className="text-xs text-[#64748B]">{getRoleLabel(log.performedByRole as StaffRole)}</div>
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-[#64748B]">
                  {log.details ? JSON.stringify(log.details) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
