import Link from "next/link";
import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole, EmployeeStatus } from "@/types/enums";
import { getEmployeeSession } from "@/lib/auth/employee-session";
import { getOnboardingEmployee } from "@/lib/services/onboarding.service";
import { OnboardingWizardLoader } from "@/features/onboarding/components/OnboardingWizardLoader";
import { createEmptyOnboardingEmployee } from "@/features/onboarding/utils/empty-employee";
import { getSubmitterStats } from "@/lib/services/submitter.service";
import { Plus } from "lucide-react";
import {
  DashboardPageHeader,
  DashboardStatCard,
} from "@/components/dashboard/DashboardUi";

export const metadata = { title: "Registration Submitter Dashboard" };

const CONTINUE_STATUSES = [
  EmployeeStatus.DRAFT,
  EmployeeStatus.SUBMITTED,
  EmployeeStatus.L1_REVIEW,
  EmployeeStatus.L1_RETURNED,
  EmployeeStatus.L2_RETURNED,
];

interface PageProps {
  searchParams: Promise<{ new?: string; continue?: string }>;
}

export default async function SubmitterDashboardPage({ searchParams }: PageProps) {
  const { user } = await requireStaffAuth(UserRole.SUBMITTER);
  const params = await searchParams;
  const forceNew = params.new === "1";
  const continueEdit = params.continue === "1";

  const [stats, session] = await Promise.all([
    getSubmitterStats(user.id),
    forceNew ? Promise.resolve(null) : getEmployeeSession(),
  ]);

  let employee = null;
  let registrationMode = true;
  let loadError: string | null = null;

  if (session) {
    try {
      employee = await getOnboardingEmployee(session.employeeId);
      if (employee) {
        if (continueEdit && CONTINUE_STATUSES.includes(employee.status)) {
          registrationMode = false;
        } else if (!continueEdit && !forceNew && employee.status === EmployeeStatus.DRAFT) {
          registrationMode = false;
        } else if (!continueEdit) {
          employee = null;
          registrationMode = true;
        } else {
          employee = null;
          registrationMode = true;
        }
      }
    } catch (error) {
      console.error("[submitter] failed to load employee for edit", error);
      loadError =
        error instanceof Error
          ? error.message
          : "Unable to open this registration for editing";
      employee = null;
      registrationMode = true;
    }
  }

  const displayEmployee = employee ?? createEmptyOnboardingEmployee();

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="New Registration"
        description={`Welcome, ${user.name}. Fill the form below — submitted records appear under All Registrations.`}
        actions={
          <Link
            href="/dashboard/submitter?new=1"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1D4ED8] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-[#1E40AF] hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            Start Fresh
          </Link>
        }
      />

      {loadError && continueEdit && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 animate-fade-in">
          Could not open for editing: {loadError}. Try again from All Registrations.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <DashboardStatCard
          title="All"
          value={stats.total}
          href="/dashboard/submitter/registrations"
          linkLabel="View all"
          tone="default"
          className="stagger-1"
        />
        <DashboardStatCard
          title="Pending L1"
          value={stats.pendingL1}
          tone="blue"
          className="stagger-2"
        />
        <DashboardStatCard
          title="Pending L2"
          value={stats.pendingL2}
          tone="slate"
          className="stagger-3"
        />
        <DashboardStatCard
          title="Reversed"
          value={stats.reversed}
          href="/dashboard/submitter/registrations/reversed"
          linkLabel="Fix & resubmit"
          tone="amber"
          className="stagger-4"
        />
        <DashboardStatCard
          title="Approved"
          value={stats.approved}
          tone="green"
          className="stagger-5"
        />
      </div>

      <div className="dashboard-panel animate-fade-in">
        <OnboardingWizardLoader
          employee={displayEmployee}
          registrationMode={registrationMode}
          submitterMode
        />
      </div>
    </div>
  );
}
