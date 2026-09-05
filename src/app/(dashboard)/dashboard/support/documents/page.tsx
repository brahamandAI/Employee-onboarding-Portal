import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { EmployeeDocumentsBrowser } from "@/features/documents/components/EmployeeDocumentsBrowser";
import { DashboardPageHeader } from "@/components/dashboard/DashboardUi";
import { DashboardBackLink } from "@/components/dashboard/DashboardBackLink";

export const metadata = { title: "Employee Documents | Support" };

export default async function SupportEmployeeDocumentsPage() {
  await requireStaffAuth(UserRole.SUPPORT);

  return (
    <div className="space-y-6">
      <DashboardBackLink href="/dashboard/support" />
      <DashboardPageHeader
        title="Employee Documents"
        description="Access employee folders after L2 approval. Open a folder to view and download documents."
      />
      <EmployeeDocumentsBrowser />
    </div>
  );
}
