import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  RotateCcw,
  XCircle,
} from "lucide-react";
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
        description="Review and approve pending registrations."
        actions={<DownloadExcelButton scope="l1" />}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard
          title="Pending"
          value={stats.pending}
          description="Waiting for L1 decision"
          href="/dashboard/l1/applications/pending"
          linkLabel="Open queue"
          tone="blue"
          icon={Clock3}
        />
        <DashboardStatCard
          title="Approved"
          value={stats.approved}
          description="Forwarded to L2"
          href="/dashboard/l1/applications/approved"
          linkLabel="History"
          tone="green"
          icon={CheckCircle2}
        />
        <DashboardStatCard
          title="Reversed"
          value={stats.rejected}
          description="Returned for correction"
          href="/dashboard/l1/applications/rejected"
          linkLabel="View"
          tone="red"
          icon={XCircle}
        />
        <DashboardStatCard
          title="Returned today"
          value={stats.returnedToday}
          description="Corrections requested today"
          tone="amber"
          icon={RotateCcw}
        />
      </div>

      <DashboardSection
        title="Recent pending"
        icon={Clock3}
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
          emptyMessage="No pending applications right now"
        />
      </DashboardSection>
    </div>
  );
}
