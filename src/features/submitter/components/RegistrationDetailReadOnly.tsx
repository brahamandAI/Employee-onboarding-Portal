"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApprovalStatusTimeline } from "@/features/submitter/components/ApprovalStatusTimeline";
import type { ApprovalTimelineItem } from "@/features/submitter/components/ApprovalStatusTimeline";
import { EmployeeDocumentsFolderPanel } from "@/features/documents/components/EmployeeDocumentsFolderPanel";

interface RegistrationDetailReadOnlyProps {
  employeeId?: string;
  employee: {
    applicationRef: string;
    status: string;
    temporaryEmployeeId?: string;
    personalDetails?: Record<string, unknown>;
    address?: Record<string, unknown>;
    education?: Record<string, unknown> | Record<string, unknown>[];
    references?: Record<string, unknown>[];
    familyDetails?: Record<string, unknown>[];
    nominee?: Record<string, unknown>;
    additionalDetails?: Record<string, unknown>;
    exServiceman?: Record<string, unknown>;
    gunman?: Record<string, unknown>;
    rejectionReason?: string;
    correctionNotes?: string;
  };
  documents: Array<{ documentType: string; fileName: string; url: string }>;
  history?: ApprovalTimelineItem[];
  /** Show employee documents folder panel (Admin / Support after L2) */
  showDocumentsFolder?: boolean;
}

function Grid({ title, data }: { title: string; data?: Record<string, unknown> }) {
  if (!data || Object.keys(data).length === 0) return null;
  return (
    <Card className="ui-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 sm:grid-cols-2">
          {Object.entries(data).map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs uppercase text-[#64748B]">
                {k.replace(/([A-Z])/g, " $1").trim()}
              </dt>
              <dd className="text-sm text-[#0F172A]">{String(v ?? "—")}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

export function RegistrationDetailReadOnly({
  employeeId,
  employee,
  documents,
  history = [],
  showDocumentsFolder = false,
}: RegistrationDetailReadOnlyProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      {history.length > 0 && (
        <ApprovalStatusTimeline history={history} currentStatus={employee.status} />
      )}

      {showDocumentsFolder && employeeId && (
        <EmployeeDocumentsFolderPanel employeeId={employeeId} />
      )}

      <Card className="ui-card">
        <CardHeader>
          <CardTitle className="text-base">Registration Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Application Ref:</span> {employee.applicationRef}
          </p>
          <p>
            <span className="font-medium">Status:</span> {employee.status.replace(/_/g, " ")}
          </p>
          {employee.temporaryEmployeeId && (
            <p>
              <span className="font-medium">Temporary Employee ID:</span>{" "}
              {employee.temporaryEmployeeId}
            </p>
          )}
          {employee.rejectionReason && (
            <p className="text-red-700">
              <span className="font-medium">Rejection Comment:</span> {employee.rejectionReason}
            </p>
          )}
          {employee.correctionNotes && (
            <p className="text-amber-700">
              <span className="font-medium">Reverse Note:</span> {employee.correctionNotes}
            </p>
          )}
        </CardContent>
      </Card>

      <Grid title="Personal Details" data={employee.personalDetails} />
      <Grid title="Address" data={employee.address} />
      <Grid
        title="Education"
        data={(employee.education as Record<string, unknown>) ?? {}}
      />
      <Grid title="Nominee Details" data={employee.nominee} />
      <Grid title="Additional Details" data={employee.additionalDetails} />
      <Grid title="Ex-Serviceman Details" data={employee.exServiceman} />
      <Grid title="Gunman Details" data={employee.gunman} />

      {employee.references && employee.references.length > 0 && (
        <Card className="ui-card">
          <CardHeader>
            <CardTitle className="text-base">References</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {employee.references.map((ref, i) => (
              <dl key={i} className="grid gap-3 border-b border-[#E2E8F0] pb-3 last:border-0 sm:grid-cols-2">
                {Object.entries(ref).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs uppercase text-[#64748B]">
                      {k.replace(/([A-Z])/g, " $1").trim()}
                    </dt>
                    <dd className="text-sm">{String(v ?? "—")}</dd>
                  </div>
                ))}
              </dl>
            ))}
          </CardContent>
        </Card>
      )}

      {employee.familyDetails && employee.familyDetails.length > 0 && (
        <Card className="ui-card">
          <CardHeader>
            <CardTitle className="text-base">Family Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {employee.familyDetails.map((member, i) => (
              <dl key={i} className="grid gap-3 border-b border-[#E2E8F0] pb-3 last:border-0 sm:grid-cols-2">
                {Object.entries(member).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs uppercase text-[#64748B]">
                      {k.replace(/([A-Z])/g, " $1").trim()}
                    </dt>
                    <dd className="text-sm">{String(v ?? "—")}</dd>
                  </div>
                ))}
              </dl>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="ui-card">
        <CardHeader>
          <CardTitle className="text-base">Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {documents.map((doc) => (
              <a
                key={`${doc.documentType}-${doc.fileName}`}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm text-primary transition hover:-translate-y-0.5 hover:bg-[#F8FAFC] hover:shadow-sm"
              >
                {doc.documentType}: {doc.fileName}
              </a>
            ))}
            {documents.length === 0 && (
              <p className="text-sm text-[#64748B]">No documents uploaded.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
