import Link from "next/link";
import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { getL1Stats, getL1RecentPending } from "@/lib/services/l1.service";
import { ApplicationTable } from "@/features/l1/components/ApplicationTable";
import { DownloadExcelButton } from "@/features/export/components/DownloadExcelButton";
import {
  DashboardPageHeader,
  DashboardSection,
  DashboardStatCard,
} from "@/components/dashboard/DashboardUi";

export const metadata = { title: "L1 Dashboard" };

export default async function L1DashboardPage() {
  const { user } = await requireStaffAuth(UserRole.L1);

  const [stats, recent] = await Promise.all([
    getL1Stats(user.id),
    getL1RecentPending(5),
  ]);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="L1 Review"
        description={`Welcome back, ${user.name}. Review and approve pending registrations.`}
        actions={<DownloadExcelButton scope="l1" />}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard
          title="Pending"
          value={stats.pending}
          href="/dashboard/l1/applications/pending"
          linkLabel="Open queue"
          tone="blue"
          className="stagger-1"
        />
        <DashboardStatCard
          title="Approved"
          value={stats.approved}
          href="/dashboard/l1/applications/approved"
          linkLabel="History"
          tone="green"
          className="stagger-2"
        />
        <DashboardStatCard
          title="Reversed"
          value={stats.rejected}
          href="/dashboard/l1/applications/rejected"
          linkLabel="View"
          tone="red"
          className="stagger-3"
        />
        <DashboardStatCard
          title="Returned today"
          value={stats.returnedToday}
          tone="amber"
          className="stagger-4"
        />
      </div>

      <DashboardSection
        title="Recent pending"
        action={
          <Link
            href="/dashboard/l1/applications/pending"
            className="text-sm font-medium text-[#1D4ED8] transition hover:underline"
          >
            View all
          </Link>
        }
      >
        <ApplicationTable
          applications={recent}
          emptyMessage="No pending applications right now."
        />
      </DashboardSection>
    </div>
  );
}
