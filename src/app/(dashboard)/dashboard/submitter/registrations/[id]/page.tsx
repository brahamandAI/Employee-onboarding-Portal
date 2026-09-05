import { notFound } from "next/navigation";
import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole, EmployeeStatus } from "@/types/enums";
import { getSubmitterRegistrationDetail } from "@/lib/services/submitter.service";
import { RegistrationDetailReadOnly } from "@/features/submitter/components/RegistrationDetailReadOnly";
import { OpenRegistrationEditButton } from "@/features/submitter/components/OpenRegistrationEditButton";
import { getRegistrationStatusLabel } from "@/features/application-status/constants";
import { DashboardBackLink } from "@/components/dashboard/DashboardBackLink";
import {
  clientHistoryItems,
  serializeRegistrationDocuments,
  serializeRegistrationEmployee,
} from "@/lib/serialize/client-props";

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
        <DashboardBackLink href="/dashboard/submitter/registrations" />
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
        employeeId={String(employee._id)}
        showDocumentsFolder={Boolean(employee.temporaryEmployeeId)}
        employee={serializeRegistrationEmployee(employee)}
        documents={serializeRegistrationDocuments(documents)}
        history={clientHistoryItems(history)}
      />
    </div>
  );
}
