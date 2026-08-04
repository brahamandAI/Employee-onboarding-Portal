import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { getL2PendingApplications } from "@/lib/services/l2.service";
import { L2ApplicationTable } from "@/features/l2/components/L2ApplicationTable";

export const metadata = { title: "Pending Applications | L2" };

export default async function L2PendingApplicationsPage() {
  await requireStaffAuth(UserRole.L2);
  const applications = await getL2PendingApplications();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">
          Pending Applications
        </h2>
        <p className="text-[#64748B]">
          Applications awaiting final L2 approval.
        </p>
      </div>
      <L2ApplicationTable
        applications={applications}
        viewPathPrefix="/dashboard/l2/applications"
        emptyMessage="No applications pending L2 approval."
      />
    </div>
  );
}
