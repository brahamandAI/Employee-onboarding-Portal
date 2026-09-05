import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { EmployeeDocumentsBrowser } from "@/features/documents/components/EmployeeDocumentsBrowser";
import { DashboardPageHeader } from "@/components/dashboard/DashboardUi";
import { DashboardBackLink } from "@/components/dashboard/DashboardBackLink";

export const metadata = { title: "Employee Documents | L2" };

export default async function L2EmployeeDocumentsPage() {
  await requireStaffAuth(UserRole.L2);

  return (
    <div className="space-y-6">
      <DashboardBackLink href="/dashboard/l2" />
      <DashboardPageHeader
        title="Employee Documents"
        description="Employee folders created after L2 approval and Temporary Employee ID generation."
      />
      <EmployeeDocumentsBrowser />
    </div>
  );
}
