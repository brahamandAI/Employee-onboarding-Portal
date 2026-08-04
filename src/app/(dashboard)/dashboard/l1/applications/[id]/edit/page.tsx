import { notFound, redirect } from "next/navigation";
import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole, EmployeeStatus } from "@/types/enums";
import { getEmployeeDetailForReview } from "@/lib/services/approval.service";
import { getOnboardingEmployee } from "@/lib/services/onboarding.service";
import { L1EditWorkspace } from "@/features/l1/components/L1EditWorkspace";
import { DashboardBackLink } from "@/components/dashboard/DashboardBackLink";

export const metadata = { title: "Edit Application | L1" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function L1EmployeeEditPage({ params }: PageProps) {
  await requireStaffAuth(UserRole.L1);
  const { id } = await params;
  const data = await getEmployeeDetailForReview(id);
  if (!data) notFound();

  const editable = [
    EmployeeStatus.SUBMITTED,
    EmployeeStatus.L1_REVIEW,
    EmployeeStatus.L1_RETURNED,
    EmployeeStatus.L2_RETURNED,
  ];
  if (!editable.includes(data.employee.status)) {
    redirect(`/dashboard/l1/applications/${id}`);
  }

  const employee = await getOnboardingEmployee(String(data.employee._id));
  if (!employee) notFound();

  return (
    <div className="space-y-4">
      <DashboardBackLink href={`/dashboard/l1/applications/${id}`} label="Back to review" />
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">Edit Registration</h2>
        <p className="text-sm text-[#64748B]">
          Update employee details. Changed fields are shown to the next approval stage.
        </p>
      </div>
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 sm:p-6">
        <L1EditWorkspace employeeId={id} employee={employee} />
      </div>
    </div>
  );
}
