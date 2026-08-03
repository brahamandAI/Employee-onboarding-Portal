import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { getAuditLogs } from "@/lib/services/audit.service";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AuditLogsTable } from "@/features/admin/components/AuditLogsTable";

export const metadata = { title: "Audit Logs | Admin" };

export default async function AdminAuditLogsPage() {
  await requireStaffAuth(UserRole.ADMIN);
  const logs = await getAuditLogs(200);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Audit Logs"
        description="Track administrative actions and system changes."
      />
      <AuditLogsTable logs={logs} />
    </div>
  );
}
