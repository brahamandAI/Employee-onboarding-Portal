import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole, EmployeeStatus } from "@/types/enums";
import { getSubmitterRegistrationDetail } from "@/lib/services/submitter.service";
import { RegistrationDetailReadOnly } from "@/features/submitter/components/RegistrationDetailReadOnly";
import { OpenRegistrationEditButton } from "@/features/submitter/components/OpenRegistrationEditButton";
import { getRegistrationStatusLabel } from "@/features/application-status/constants";

export const metadata = { title: "Registration Details | Submitter" };

interface PageProps {
  params: Promise<{ id: string }>;
}

const EDITABLE = new Set([
  EmployeeStatus.DRAFT,
  EmployeeStatus.SUBMITTED,
  EmployeeStatus.L1_REVIEW,
  EmployeeStatus.L1_RETURNED,
  EmployeeStatus.L2_RETURNED,
]);

export default async function SubmitterRegistrationDetailPage({ params }: PageProps) {
  const { user } = await requireStaffAuth(UserRole.SUBMITTER);
  const { id } = await params;
  const data = await getSubmitterRegistrationDetail(user.id, id);
  if (!data) notFound();

  const { employee, documents, history } = data;
  const canEdit = EDITABLE.has(employee.status);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/submitter/registrations"
          className="inline-flex items-center gap-1 text-sm text-primary transition hover:gap-2 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all registrations
        </Link>
        {canEdit && <OpenRegistrationEditButton employeeId={String(employee._id)} />}
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h2 className="font-heading text-2xl font-bold text-primary">
          {(employee.personalDetails as { fullName?: string } | undefined)?.fullName ??
            "Registration Details"}
        </h2>
        <p className="mt-1 text-sm text-[#64748B]">{employee.applicationRef}</p>
        <p className="mt-2 inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-800">
          {getRegistrationStatusLabel(employee.status)}
        </p>
      </div>

      <RegistrationDetailReadOnly
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
