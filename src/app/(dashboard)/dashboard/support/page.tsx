import Link from "next/link";
import { CheckCircle2, FileCheck2 } from "lucide-react";
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
  await requireStaffAuth(UserRole.SUPPORT);

  const [stats, recent] = await Promise.all([
    getSupportStats(),
    getRecentPendingIdCards(5),
  ]);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Support"
        description="View L2-approved registrations and employee documents."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <DashboardStatCard
          title="L2 approved"
          value={stats.pending}
          description="Ready for support processing"
          href="/dashboard/support/registrations"
          linkLabel="Open list"
          tone="blue"
          icon={FileCheck2}
        />
        <DashboardStatCard
          title="ID cards issued"
          value={stats.completed}
          description="Completed ID card workflow"
          href="/dashboard/support/registrations"
          linkLabel="View"
          tone="green"
          icon={CheckCircle2}
        />
      </div>

      <DashboardSection
        title="Recent registrations"
        icon={FileCheck2}
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
          emptyMessage="No L2-approved registrations yet"
        />
      </DashboardSection>
    </div>
  );
}
