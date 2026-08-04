import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { EmployeeDocumentsBrowser } from "@/features/documents/components/EmployeeDocumentsBrowser";
import { DashboardPageHeader } from "@/components/dashboard/DashboardUi";
import { DashboardBackLink } from "@/components/dashboard/DashboardBackLink";

export const metadata = { title: "Employee Documents | Submitter" };

export default async function SubmitterEmployeeDocumentsPage() {
  await requireStaffAuth(UserRole.SUBMITTER);

  return (
    <div className="space-y-6">
      <DashboardBackLink href="/dashboard/submitter" label="Back to dashboard" />
      <DashboardPageHeader
        title="Employee Documents"
        description="Your employee folders appear here after L2 approval. You can only access folders for registrations you submitted."
      />
      <EmployeeDocumentsBrowser />
    </div>
  );
}
