import { notFound } from "next/navigation";
import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { getEmployeeDetailForReview } from "@/lib/services/approval.service";
import { EmployeeDetailView } from "@/features/l2/components/EmployeeDetailView";
import { DashboardBackLink } from "@/components/dashboard/DashboardBackLink";
import { mapReviewDocuments } from "@/features/documents/utils/map-review-documents";

export const metadata = { title: "Application Details | L2" };

/** Always read the latest decision state so the status stays live. */
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function L2EmployeeDetailPage({ params }: PageProps) {
  await requireStaffAuth(UserRole.L2);
  const { id } = await params;
  const data = await getEmployeeDetailForReview(id);

  if (!data) {
    notFound();
  }

  const { employee, documents, history } = data;

  return (
    <div className="space-y-4">
      <DashboardBackLink href="/dashboard/l2/applications/pending" label="Back to applications" />
      <EmployeeDetailView
        employee={{
          _id: String(employee._id),
          applicationRef: employee.applicationRef,
          status: employee.status,
          email: employee.email,
          phone: employee.phone,
          employeeId: employee.employeeId,
          temporaryEmployeeId: employee.temporaryEmployeeId,
          personalDetails: employee.personalDetails as Record<string, unknown>,
          address: employee.address as Record<string, unknown>,
          education: employee.education as Record<string, unknown>,
          references: employee.references as Record<string, unknown>[],
          familyDetails: employee.familyDetails as Record<string, unknown>[],
          nominee: employee.nominee as Record<string, unknown>,
          exServiceman: employee.exServiceman as Record<string, unknown>,
          gunman: (employee as { gunman?: Record<string, unknown> }).gunman,
          additionalDetails: employee.additionalDetails as Record<string, unknown>,
          l1Decision: employee.l1Decision
            ? {
                action: employee.l1Decision.action,
                comment: employee.l1Decision.comment,
                decidedAt: employee.l1Decision.decidedAt,
                decidedBy: (() => {
                  const d = employee.l1Decision.decidedBy as
                    | { name?: string; email?: string }
                    | null
                    | undefined;
                  return d?.name ? { name: d.name, email: d.email } : null;
                })(),
              }
            : undefined,
          l2Decision: employee.l2Decision
            ? {
                action: employee.l2Decision.action,
                comment: employee.l2Decision.comment,
                decidedAt: employee.l2Decision.decidedAt,
                decidedBy: (() => {
                  const d = employee.l2Decision.decidedBy as
                    | { name?: string; email?: string }
                    | null
                    | undefined;
                  return d?.name ? { name: d.name, email: d.email } : null;
                })(),
              }
            : undefined,
          submittedAt: employee.submittedAt,
          submittedBy: (() => {
            const s = employee.submittedBy as
              | { name?: string; email?: string }
              | null
              | undefined;
            return s?.name ? { name: s.name, email: s.email } : null;
          })(),
          correctionNotes: employee.correctionNotes,
          rejectionReason: employee.rejectionReason,
          forwardedToSupportAt: employee.forwardedToSupportAt,
          forwardedToAdminAt: employee.forwardedToAdminAt,
          pendingFieldChanges: (
            employee as {
              pendingFieldChanges?: Array<{
                path: string;
                label: string;
                oldValue: string;
                newValue: string;
              }>;
            }
          ).pendingFieldChanges,
        }}
        documents={mapReviewDocuments(documents)}
        history={history.map((h) => ({
          action: h.action,
          fromStatus: h.fromStatus,
          toStatus: h.toStatus,
          comment: h.comment,
          createdAt: h.createdAt,
          performedBy: h.performedBy as { name?: string } | undefined,
        }))}
      />
    </div>
  );
}
