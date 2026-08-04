import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/features/l1/components/StatusBadge";
import { L1ActionPanel } from "@/features/l1/components/L1ActionPanel";
import { FieldChangesPanel } from "@/features/approval/components/FieldChangesPanel";
import { ApprovalTimeline } from "@/components/dashboard/ApprovalTimeline";
import { EmployeeStatus } from "@/types/enums";
import { ExternalLink, Pencil, History } from "lucide-react";
import Link from "next/link";

interface DocumentItem {
  documentType: string;
  fileName: string;
  url: string;
}

interface HistoryItem {
  action: string;
  fromStatus: string;
  toStatus: string;
  comment?: string;
  createdAt: Date;
  performedBy?: { name?: string };
}

interface EmployeeDetailViewProps {
  employee: {
    _id: string;
    applicationRef: string;
    status: EmployeeStatus;
    email: string;
    phone: string;
    employeeId?: string;
    personalDetails?: Record<string, unknown>;
    address?: Record<string, unknown>;
    education?: Record<string, unknown> | Record<string, unknown>[];
    references?: Record<string, unknown>[];
    familyDetails?: Record<string, unknown>[];
    nominee?: Record<string, unknown>;
    exServiceman?: Record<string, unknown>;
    gunman?: Record<string, unknown>;
    additionalDetails?: Record<string, unknown>;
    declaration?: Record<string, unknown>;
    submittedAt?: Date;
    submittedBy?: { name?: string; email?: string } | null;
    l1Decision?: {
      action: "APPROVE" | "REJECT" | "RETURN";
      comment?: string;
      decidedAt?: Date;
      decidedBy?: { name?: string; email?: string } | null;
    };
    correctionNotes?: string;
    rejectionReason?: string;
    pendingFieldChanges?: Array<{
      path: string;
      label: string;
      oldValue: string;
      newValue: string;
    }>;
  };
  documents: DocumentItem[];
  history: HistoryItem[];
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function KeyValueGrid({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );

  if (entries.length === 0) {
    return <p className="text-sm text-[#64748B]">No data provided.</p>;
  }

  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {entries.map(([key, value]) => (
        <div key={key}>
          <dt className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
            {key.replace(/([A-Z])/g, " $1").trim()}
          </dt>
          <dd className="mt-0.5 text-sm text-primary">
            {typeof value === "boolean"
              ? value
                ? "Yes"
                : "No"
              : String(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function EmployeeDetailView({
  employee,
  documents,
  history,
}: EmployeeDetailViewProps) {
  const personal = employee.personalDetails ?? {};
  const fullName = (personal.fullName as string) ?? "Unknown";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-primary">
            {fullName}
          </h2>
          <p className="text-[#64748B]">{employee.applicationRef}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={employee.status} />
            {employee.employeeId && (
              <span className="font-mono text-sm text-primary">
                ID: {employee.employeeId}
              </span>
            )}
          </div>
        </div>
        {[
          EmployeeStatus.SUBMITTED,
          EmployeeStatus.L1_REVIEW,
          EmployeeStatus.L1_RETURNED,
          EmployeeStatus.L2_RETURNED,
        ].includes(employee.status) && (
          <Link
            href={`/dashboard/l1/applications/${employee._id}/edit`}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-primary px-3 text-sm font-medium text-primary hover:bg-primary/5"
          >
            <Pencil className="h-4 w-4" />
            Edit Details
          </Link>
        )}
      </div>

      <FieldChangesPanel changes={employee.pendingFieldChanges} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4 text-[#1D4ED8]" />
            Approval Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ApprovalTimeline status={employee.status} />
        </CardContent>
      </Card>

      {employee.submittedBy?.name && (
        <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3">
          <p className="text-sm font-medium text-sky-800">Submitted by</p>
          <p className="mt-1 text-sm text-sky-700">
            {employee.submittedBy.name}
            {employee.submittedBy.email ? ` (${employee.submittedBy.email})` : ""}
          </p>
        </div>
      )}

      {(employee.correctionNotes || employee.rejectionReason) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
          <p className="text-sm font-medium">
            {employee.status === EmployeeStatus.L1_REVIEW && employee.correctionNotes
              ? "Note from L2 (sent back to L1)"
              : employee.rejectionReason
                ? "Reverse Note"
                : "Correction Notes"}
          </p>
          <p className="mt-1 text-sm">
            {employee.rejectionReason ?? employee.correctionNotes}
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <DetailSection title="Contact">
          <KeyValueGrid
            data={{
              email: employee.email,
              phone: employee.phone,
              submittedAt: employee.submittedAt
                ? new Date(employee.submittedAt).toLocaleString("en-IN")
                : undefined,
              submittedBy: employee.submittedBy?.name,
            }}
          />
        </DetailSection>

        <DetailSection title="Personal Details">
          <KeyValueGrid data={personal} />
        </DetailSection>

        {employee.address && (
          <DetailSection title="Address">
            <KeyValueGrid data={employee.address as Record<string, unknown>} />
          </DetailSection>
        )}

        {employee.nominee && (
          <DetailSection title="Nominee">
            <KeyValueGrid data={employee.nominee} />
          </DetailSection>
        )}

        {employee.exServiceman && (
          <DetailSection title="Ex Serviceman">
            <KeyValueGrid data={employee.exServiceman} />
          </DetailSection>
        )}

        {employee.gunman && (
          <DetailSection title="Gunman">
            <KeyValueGrid data={employee.gunman} />
          </DetailSection>
        )}

        {employee.additionalDetails && (
          <DetailSection title="Additional Details">
            <KeyValueGrid data={employee.additionalDetails} />
          </DetailSection>
        )}
      </div>

      {employee.education && (
        <DetailSection title="Education">
          {Array.isArray(employee.education) ? (
            <div className="space-y-4">
              {employee.education.map((edu, i) => (
                <KeyValueGrid key={i} data={edu} />
              ))}
            </div>
          ) : (
            <KeyValueGrid data={employee.education} />
          )}
        </DetailSection>
      )}

      {employee.references && employee.references.length > 0 && (
        <DetailSection title="References">
          <div className="space-y-4">
            {employee.references.map((ref, i) => (
              <KeyValueGrid key={i} data={ref} />
            ))}
          </div>
        </DetailSection>
      )}

      {employee.familyDetails && employee.familyDetails.length > 0 && (
        <DetailSection title="Family Details">
          <div className="space-y-4">
            {employee.familyDetails.map((member, i) => (
              <KeyValueGrid key={i} data={member} />
            ))}
          </div>
        </DetailSection>
      )}

      <DetailSection title="Documents">
        {documents.length === 0 ? (
          <p className="text-sm text-[#64748B]">No documents uploaded.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <a
                key={doc.documentType}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] p-3 text-sm hover:bg-[#F8FAFC]"
              >
                <ExternalLink className="h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-primary">{doc.documentType}</p>
                  <p className="truncate text-xs text-[#64748B]">{doc.fileName}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </DetailSection>

      {history.length > 0 && (
        <DetailSection title="Approval History">
          <div className="space-y-3">
            {history.map((item, i) => (
              <div
                key={i}
                className="flex flex-wrap items-start justify-between gap-2 border-b border-[#E2E8F0] pb-3 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-primary">
                    {item.action.replace(/_/g, " ")}
                  </p>
                  <p className="text-xs text-[#64748B]">
                    {item.fromStatus} → {item.toStatus}
                    {item.performedBy?.name && ` · ${item.performedBy.name}`}
                  </p>
                  {item.comment && (
                    <p className="mt-1 text-sm text-[#64748B]">{item.comment}</p>
                  )}
                </div>
                <time className="text-xs text-[#64748B]">
                  {new Date(item.createdAt).toLocaleString("en-IN")}
                </time>
              </div>
            ))}
          </div>
        </DetailSection>
      )}

      <section className="mt-2 space-y-3 border-t border-[#E2E8F0] pt-6">
        <div>
          <h3 className="font-heading text-lg font-semibold text-primary">
            Review Decision
          </h3>
          <p className="text-sm text-[#64748B]">
            Review all employee details and documents above, then take action below.
          </p>
        </div>
        <L1ActionPanel
          employeeId={employee._id}
          status={employee.status}
          employeeIdCode={employee.employeeId}
        />
      </section>
    </div>
  );
}
