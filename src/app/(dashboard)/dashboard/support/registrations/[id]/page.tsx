import { notFound } from "next/navigation";
import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { getEmployeeDetailForReview } from "@/lib/services/approval.service";
import { RegistrationDetailReadOnly } from "@/features/submitter/components/RegistrationDetailReadOnly";
import { DashboardBackLink } from "@/components/dashboard/DashboardBackLink";
import {
  clientHistoryItems,
  serializeRegistrationDocuments,
  serializeRegistrationEmployee,
} from "@/lib/serialize/client-props";

export const metadata = { title: "Registration Details | Support" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SupportRegistrationDetailPage({ params }: PageProps) {
  await requireStaffAuth(UserRole.SUPPORT);
  const { id } = await params;
  const data = await getEmployeeDetailForReview(id);
  if (!data) notFound();

  const { employee, documents, history } = data;
  return (
    <div className="space-y-4">
      <DashboardBackLink href="/dashboard/support/registrations" />
      <RegistrationDetailReadOnly
        employeeId={String(employee._id)}
        showDocumentsFolder
        employee={serializeRegistrationEmployee(employee)}
        documents={serializeRegistrationDocuments(documents)}
        history={clientHistoryItems(history)}
      />
    </div>
  );
}
