import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { EmployeeDocumentsBrowser } from "@/features/documents/components/EmployeeDocumentsBrowser";
import { DashboardPageHeader } from "@/components/dashboard/DashboardUi";
import { DashboardBackLink } from "@/components/dashboard/DashboardBackLink";

export const metadata = { title: "Employee Documents | Admin" };

export default async function AdminEmployeeDocumentsPage() {
  await requireStaffAuth(UserRole.ADMIN);

  return (
    <div className="space-y-6">
      <DashboardBackLink href="/dashboard/admin" />
      <DashboardPageHeader
        title="Employee Documents"
        description="Main folder containing every employee folder created after L2 approval."
      />
      <EmployeeDocumentsBrowser />
    </div>
  );
}
