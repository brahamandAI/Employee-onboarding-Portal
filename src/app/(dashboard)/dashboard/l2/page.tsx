import Link from "next/link";
import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { getL2Stats, getL2RecentPending } from "@/lib/services/l2.service";
import { L2ApplicationTable } from "@/features/l2/components/L2ApplicationTable";
import { DownloadExcelButton } from "@/features/export/components/DownloadExcelButton";
import {
  DashboardPageHeader,
  DashboardSection,
  DashboardStatCard,
} from "@/components/dashboard/DashboardUi";

export const metadata = { title: "L2 Dashboard" };

export default async function L2DashboardPage() {
  const { user } = await requireStaffAuth(UserRole.L2);

  const [stats, recent] = await Promise.all([
    getL2Stats(user.id),
    getL2RecentPending(5),
  ]);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="L2 Approval"
        description={`Welcome back, ${user.name}. Final review and temporary ID generation.`}
        actions={<DownloadExcelButton scope="l2" />}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard
          title="Awaiting approval"
          value={stats.pending}
          href="/dashboard/l2/applications/pending"
          linkLabel="Open queue"
          tone="blue"
          className="stagger-1"
        />
        <DashboardStatCard
          title="Approved"
          value={stats.approved}
          href="/dashboard/l2/applications/approved"
          linkLabel="History"
          tone="green"
          className="stagger-2"
        />
        <DashboardStatCard
          title="Reversed"
          value={stats.rejected}
          href="/dashboard/l2/applications/rejected"
          linkLabel="View"
          tone="red"
          className="stagger-3"
        />
        <DashboardStatCard
          title="Sent to Admin"
          value={stats.forwarded}
          hint={`${stats.approvedThisMonth} this month`}
          tone="slate"
          className="stagger-4"
        />
      </div>

      <DashboardSection
        title="Recent pending"
        action={
          <Link
            href="/dashboard/l2/applications/pending"
            className="text-sm font-medium text-[#1D4ED8] transition hover:underline"
          >
            View all
          </Link>
        }
      >
        <L2ApplicationTable
          applications={recent}
          viewPathPrefix="/dashboard/l2/applications"
          emptyMessage="No applications awaiting L2 approval."
        />
      </DashboardSection>
    </div>
  );
}
