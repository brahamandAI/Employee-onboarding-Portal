import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/features/l1/components/StatusBadge";
import { L2ActionPanel } from "@/features/l2/components/L2ActionPanel";
import { FieldChangesPanel } from "@/features/approval/components/FieldChangesPanel";
import { EmployeeDocumentsFolderPanel } from "@/features/documents/components/EmployeeDocumentsFolderPanel";
import { ApprovalTimeline } from "@/components/dashboard/ApprovalTimeline";
import { EmployeeStatus } from "@/types/enums";
import {
  ExternalLink,
  LucideIcon,
  User,
  MapPin,
  GraduationCap,
  Users,
  HeartHandshake,
  FileText,
  Shield,
  History,
  IdCard,
  Contact,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    temporaryEmployeeId?: string;
    personalDetails?: Record<string, unknown>;
    address?: Record<string, unknown>;
    education?: Record<string, unknown> | Record<string, unknown>[];
    references?: Record<string, unknown>[];
    familyDetails?: Record<string, unknown>[];
    nominee?: Record<string, unknown>;
    exServiceman?: Record<string, unknown>;
    gunman?: Record<string, unknown>;
    additionalDetails?: Record<string, unknown>;
    l1Decision?: {
      action: string;
      comment?: string;
      decidedAt?: Date;
      decidedBy?: { name?: string; email?: string } | null;
    };
    l2Decision?: {
      action: "APPROVE" | "REJECT" | "RETURN" | "FORWARD";
      comment?: string;
      decidedAt?: Date;
      decidedBy?: { name?: string; email?: string } | null;
    };
    submittedAt?: Date;
    submittedBy?: { name?: string; email?: string } | null;
    correctionNotes?: string;
    rejectionReason?: string;
    forwardedToSupportAt?: Date;
    forwardedToAdminAt?: Date;
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
  icon: Icon,
  className,
}: {
  title: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-gradient-to-r from-[#F8FAFC] to-white">
        <CardTitle className="flex items-center gap-2 text-base">
          {Icon && (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8]">
              <Icon className="h-4 w-4" />
            </span>
          )}
          {title}
        </CardTitle>
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
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">
              Employee summary
            </p>
            <h2 className="mt-1 font-heading text-2xl font-bold text-primary">
              {fullName}
            </h2>
            <p className="mt-1 text-sm text-[#64748B]">{employee.applicationRef}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={employee.status} />
              {employee.temporaryEmployeeId && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
                  <IdCard className="h-3.5 w-3.5" />
                  Temp ID: {employee.temporaryEmployeeId}
                </span>
              )}
              {employee.employeeId && (
                <span className="font-mono text-sm text-primary">
                  ID: {employee.employeeId}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <FieldChangesPanel changes={employee.pendingFieldChanges} />

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
            {employee.rejectionReason ? "Reverse Note" : "Correction Notes"}
          </p>
          <p className="mt-1 text-sm">
            {employee.rejectionReason ?? employee.correctionNotes}
          </p>
        </div>
      )}

      {employee.l1Decision && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-sm font-medium text-emerald-800">
            {employee.l1Decision.action === "APPROVE"
              ? "L1 Approved by"
              : "L1 Decision"}
          </p>
          <p className="mt-1 text-sm text-emerald-700">
            {employee.l1Decision.decidedBy?.name
              ? employee.l1Decision.decidedBy.name
              : employee.l1Decision.action}
            {employee.l1Decision.decidedAt
              ? ` — ${new Date(employee.l1Decision.decidedAt).toLocaleString("en-IN")}`
              : ""}
            {employee.l1Decision.comment && ` — ${employee.l1Decision.comment}`}
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <DetailSection title="Approval Timeline" icon={History} className="lg:col-span-1">
          <ApprovalTimeline status={employee.status} />
        </DetailSection>
        <div className="grid gap-6 lg:col-span-2 lg:grid-cols-2">
        <DetailSection title="Contact" icon={Contact}>
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

        <DetailSection title="Personal Details" icon={User}>
          <KeyValueGrid data={personal} />
        </DetailSection>

        {employee.address && (
          <DetailSection title="Address" icon={MapPin}>
            <KeyValueGrid data={employee.address as Record<string, unknown>} />
          </DetailSection>
        )}

        {employee.nominee && (
          <DetailSection title="Nominee" icon={HeartHandshake}>
            <KeyValueGrid data={employee.nominee} />
          </DetailSection>
        )}

        {employee.exServiceman && (
          <DetailSection title="Ex Serviceman" icon={Shield}>
            <KeyValueGrid data={employee.exServiceman} />
          </DetailSection>
        )}

        {employee.gunman && (
          <DetailSection title="Gunman" icon={Shield}>
            <KeyValueGrid data={employee.gunman} />
          </DetailSection>
        )}

        {employee.additionalDetails && (
          <DetailSection title="Additional Details" icon={FileText}>
            <KeyValueGrid data={employee.additionalDetails} />
          </DetailSection>
        )}
        </div>
      </div>

      {employee.education && (
        <DetailSection title="Education" icon={GraduationCap}>
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
        <DetailSection title="References" icon={Users}>
          <div className="space-y-4">
            {employee.references.map((ref, i) => (
              <KeyValueGrid key={i} data={ref} />
            ))}
          </div>
        </DetailSection>
      )}

      {employee.familyDetails && employee.familyDetails.length > 0 && (
        <DetailSection title="Family Details" icon={Users}>
          <div className="space-y-4">
            {employee.familyDetails.map((member, i) => (
              <KeyValueGrid key={i} data={member} />
            ))}
          </div>
        </DetailSection>
      )}

      <DetailSection title="Uploaded Documents" icon={FileText}>
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

      {(employee.temporaryEmployeeId ||
        employee.status === EmployeeStatus.L2_REVIEW ||
        [
          EmployeeStatus.APPROVED,
          EmployeeStatus.ID_GENERATED,
          EmployeeStatus.ID_CARD_ISSUED,
        ].includes(employee.status)) && (
        <EmployeeDocumentsFolderPanel
          employeeId={employee._id}
          showWhenEmpty={employee.status === EmployeeStatus.L2_REVIEW}
        />
      )}

      {history.length > 0 && (
        <DetailSection title="Approval History" icon={History}>
          <div className="space-y-3">
            {history.map((item, i) => (
              <div
                key={i}
                className="flex flex-wrap items-start justify-between gap-2 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC]/80 px-3 py-3"
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

      <section className="mt-2 space-y-3 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h3 className="font-heading text-lg font-semibold text-primary">
            Review Decision
          </h3>
          <p className="text-sm text-[#64748B]">
            Review all employee details and documents above, then take action below.
          </p>
        </div>
        <L2ActionPanel
          employeeId={employee._id}
          status={employee.status}
          employeeIdCode={employee.temporaryEmployeeId ?? employee.employeeId}
          l1DecisionAction={employee.l1Decision?.action}
          l2DecisionAction={employee.l2Decision?.action}
          forwardedToSupportAt={employee.forwardedToSupportAt?.toISOString()}
          forwardedToAdminAt={employee.forwardedToAdminAt?.toISOString()}
        />
      </section>
    </div>
  );
}
