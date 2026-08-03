import { DownloadHistoryItem } from "@/lib/services/support.service";

interface DownloadHistoryTableProps {
  items: DownloadHistoryItem[];
}

const ACTION_LABELS: Record<string, string> = {
  PREVIEW: "Preview",
  DOWNLOAD: "Download PDF",
  GENERATE: "Generate",
  COMPLETE: "Mark Completed",
};

export function DownloadHistoryTable({ items }: DownloadHistoryTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-white p-12 text-center">
        <p className="text-[#64748B]">No download history yet.</p>
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
                Date
              </th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">
                Employee
              </th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">
                Employee ID
              </th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">
                Action
              </th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">
                By
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item._id}
                className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC]"
              >
                <td className="px-4 py-3 text-[#64748B]">
                  {new Date(item.createdAt).toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 font-medium text-primary">
                  {item.employeeName}
                </td>
                <td className="px-4 py-3 font-mono">{item.employeeIdCode}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {ACTION_LABELS[item.action] ?? item.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#64748B]">
                  {item.performedByName ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
