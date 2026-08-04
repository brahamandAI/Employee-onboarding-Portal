import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { getL2ApprovedApplications } from "@/lib/services/l2.service";
import { ApplicationTable } from "@/features/l1/components/ApplicationTable";

export const metadata = { title: "Approved Applications | L2" };

export default async function L2ApprovedApplicationsPage() {
  const { user } = await requireStaffAuth(UserRole.L2);
  const applications = await getL2ApprovedApplications(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">
          Approved Applications
        </h2>
        <p className="text-[#64748B]">
          Applications you have approved and forwarded for processing.
        </p>
      </div>
      <ApplicationTable
        applications={applications}
        showEmployeeId
        viewPathPrefix="/dashboard/l2/applications"
        emptyMessage="No approved applications yet."
      />
    </div>
  );
}
