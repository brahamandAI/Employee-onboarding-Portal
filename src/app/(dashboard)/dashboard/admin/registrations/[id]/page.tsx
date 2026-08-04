import { notFound } from "next/navigation";
import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { getEmployeeDetailForReview } from "@/lib/services/approval.service";
import { RegistrationDetailReadOnly } from "@/features/submitter/components/RegistrationDetailReadOnly";
import { DashboardBackLink } from "@/components/dashboard/DashboardBackLink";

export const metadata = { title: "Registration Details | Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminRegistrationDetailPage({ params }: PageProps) {
  await requireStaffAuth(UserRole.ADMIN);
  const { id } = await params;
  const data = await getEmployeeDetailForReview(id);
  if (!data) notFound();

  const { employee, documents, history } = data;
  return (
    <div className="space-y-4">
      <DashboardBackLink href="/dashboard/admin/registrations" label="Back to registrations" />
      <RegistrationDetailReadOnly
        employeeId={String(employee._id)}
        showDocumentsFolder
        employee={{
          applicationRef: employee.applicationRef,
          status: String(employee.status),
          temporaryEmployeeId: employee.temporaryEmployeeId,
          personalDetails: employee.personalDetails as Record<string, unknown>,
          address: employee.address as Record<string, unknown>,
          education: employee.education as Record<string, unknown>,
          references: employee.references as Record<string, unknown>[],
          familyDetails: employee.familyDetails as Record<string, unknown>[],
          nominee: employee.nominee as Record<string, unknown>,
          additionalDetails: employee.additionalDetails as Record<string, unknown>,
          exServiceman: employee.exServiceman as Record<string, unknown>,
          gunman: (employee as { gunman?: Record<string, unknown> }).gunman,
          rejectionReason: employee.rejectionReason ?? undefined,
          correctionNotes: employee.correctionNotes ?? undefined,
        }}
        documents={documents.map((d) => ({
          documentType: d.documentType,
          fileName: d.fileName,
          url: d.url,
        }))}
        history={history.map((h) => ({
          action: h.action,
          fromStatus: h.fromStatus,
          toStatus: h.toStatus,
          comment: h.comment,
          createdAt: h.createdAt,
          performedBy: h.performedBy as { name?: string } | undefined,
          performedByRole: h.performedByRole,
        }))}
      />
    </div>
  );
}
