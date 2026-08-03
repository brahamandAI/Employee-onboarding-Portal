import Link from "next/link";
import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { getSupportStats, getRecentPendingIdCards } from "@/lib/services/support.service";
import { IdCardQueueTable } from "@/features/support/components/IdCardQueueTable";
import {
  DashboardPageHeader,
  DashboardSection,
  DashboardStatCard,
} from "@/components/dashboard/DashboardUi";

export const metadata = { title: "Support Dashboard" };

export default async function SupportDashboardPage() {
  const { user } = await requireStaffAuth(UserRole.SUPPORT);

  const [stats, recent] = await Promise.all([
    getSupportStats(),
    getRecentPendingIdCards(5),
  ]);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Support"
        description={`Welcome back, ${user.name}. View L2-approved registrations and employee documents.`}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <DashboardStatCard
          title="L2 approved"
          value={stats.pending}
          href="/dashboard/support/registrations"
          linkLabel="Open list"
          tone="blue"
          className="stagger-1"
        />
        <DashboardStatCard
          title="ID cards issued"
          value={stats.completed}
          href="/dashboard/support/registrations"
          linkLabel="View"
          tone="green"
          className="stagger-2"
        />
      </div>

      <DashboardSection
        title="Recent registrations"
        action={
          <Link
            href="/dashboard/support/registrations"
            className="text-sm font-medium text-[#1D4ED8] transition hover:underline"
          >
            View all
          </Link>
        }
      >
        <IdCardQueueTable
          items={recent}
          emptyMessage="No L2-approved registrations yet."
        />
      </DashboardSection>
    </div>
  );
}
