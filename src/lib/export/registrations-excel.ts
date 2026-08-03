/** Flatten registration records into Excel-friendly rows and build an .xls (SpreadsheetML) file. */

function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function flattenValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  if (Array.isArray(value)) {
    return value
      .map((item, idx) => {
        if (item && typeof item === "object") {
          return Object.entries(item as Record<string, unknown>)
            .filter(([, v]) => v !== undefined && v !== null && v !== "")
            .map(([k, v]) => `${k}: ${cell(v)}`)
            .join("; ");
        }
        return `${idx + 1}: ${cell(item)}`;
      })
      .filter(Boolean)
      .join(" | ");
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => `${k}: ${cell(v)}`)
      .join("; ");
  }
  return cell(value);
}

export type RegistrationExportSource = {
  applicationRef?: string;
  status?: string;
  email?: string;
  phone?: string;
  employeeId?: string;
  temporaryEmployeeId?: string;
  submittedAt?: Date | string;
  l1ApprovedAt?: Date | string;
  approvedAt?: Date | string;
  correctionNotes?: string;
  personalDetails?: Record<string, unknown>;
  address?: Record<string, unknown>;
  education?: Record<string, unknown>;
  references?: unknown[];
  familyDetails?: unknown[];
  nominee?: Record<string, unknown>;
  exServiceman?: Record<string, unknown>;
  gunman?: Record<string, unknown>;
  additionalDetails?: Record<string, unknown>;
  declaration?: Record<string, unknown>;
  submittedBy?: { name?: string; email?: string } | null;
  l1Decision?: {
    action?: string;
    comment?: string;
    decidedAt?: Date | string;
    decidedBy?: { name?: string } | null;
  };
  l2Decision?: {
    action?: string;
    comment?: string;
    decidedAt?: Date | string;
    decidedBy?: { name?: string } | null;
  };
};

const COLUMNS: Array<{ key: string; header: string; get: (r: RegistrationExportSource) => unknown }> = [
  { key: "applicationRef", header: "Application Ref", get: (r) => r.applicationRef },
  { key: "status", header: "Status", get: (r) => r.status },
  { key: "employeeId", header: "Employee ID", get: (r) => r.employeeId },
  { key: "temporaryEmployeeId", header: "Temporary Employee ID", get: (r) => r.temporaryEmployeeId },
  { key: "submittedBy", header: "Submitted By", get: (r) => r.submittedBy?.name },
  { key: "submittedByEmail", header: "Submitter Email", get: (r) => r.submittedBy?.email },
  { key: "submittedAt", header: "Submitted At", get: (r) => r.submittedAt },
  { key: "l1ApprovedBy", header: "L1 Approved By", get: (r) => r.l1Decision?.decidedBy?.name },
  { key: "l1ApprovedAt", header: "L1 Approved At", get: (r) => r.l1ApprovedAt ?? r.l1Decision?.decidedAt },
  { key: "l1Comment", header: "L1 Comment", get: (r) => r.l1Decision?.comment },
  { key: "l2ApprovedBy", header: "L2 Decision By", get: (r) => r.l2Decision?.decidedBy?.name },
  { key: "l2Action", header: "L2 Action", get: (r) => r.l2Decision?.action },
  { key: "l2Comment", header: "L2 Comment", get: (r) => r.l2Decision?.comment },
  { key: "approvedAt", header: "Approved At", get: (r) => r.approvedAt },
  { key: "correctionNotes", header: "Correction / Reverse Notes", get: (r) => r.correctionNotes },
  { key: "email", header: "Email", get: (r) => r.email },
  { key: "phone", header: "Phone", get: (r) => r.phone },
  { key: "branchName", header: "Branch Name", get: (r) => r.personalDetails?.branchName },
  { key: "clientId", header: "Client ID", get: (r) => r.personalDetails?.clientId },
  { key: "clientName", header: "Client Name", get: (r) => r.personalDetails?.clientName },
  { key: "siteName", header: "Site Name", get: (r) => r.personalDetails?.siteName },
  { key: "dateOfJoining", header: "Date of Joining", get: (r) => r.personalDetails?.dateOfJoining },
  { key: "postAppliedFor", header: "Post Applied For", get: (r) => r.personalDetails?.postAppliedFor },
  { key: "fullName", header: "Full Name", get: (r) => r.personalDetails?.fullName },
  { key: "fatherName", header: "Father Name", get: (r) => r.personalDetails?.fatherName },
  { key: "motherName", header: "Mother Name", get: (r) => r.personalDetails?.motherName },
  { key: "spouseOrNok", header: "Spouse Name", get: (r) => r.personalDetails?.spouseOrNok },
  { key: "dateOfBirth", header: "Date of Birth", get: (r) => r.personalDetails?.dateOfBirth },
  { key: "maritalStatus", header: "Marital Status", get: (r) => r.personalDetails?.maritalStatus },
  { key: "bloodGroup", header: "Blood Group", get: (r) => r.personalDetails?.bloodGroup },
  { key: "aadhaarNumber", header: "Aadhaar Number", get: (r) => r.personalDetails?.aadhaarNumber },
  { key: "panNumber", header: "PAN Number", get: (r) => r.personalDetails?.panNumber },
  { key: "identificationMarks", header: "Identification Marks", get: (r) => r.personalDetails?.identificationMarks },
  { key: "localAddress", header: "Local Address", get: (r) => r.address?.localAddress },
  { key: "permanentAddress", header: "Permanent Address", get: (r) => r.address?.permanentAddress },
  { key: "education", header: "Education", get: (r) => flattenValue(r.education) },
  { key: "references", header: "References", get: (r) => flattenValue(r.references) },
  { key: "familyDetails", header: "Family Details", get: (r) => flattenValue(r.familyDetails) },
  { key: "nominee", header: "Nominee", get: (r) => flattenValue(r.nominee) },
  { key: "exServiceman", header: "Ex-Serviceman", get: (r) => flattenValue(r.exServiceman) },
  { key: "gunman", header: "Gunman", get: (r) => flattenValue(r.gunman) },
  { key: "height", header: "Height", get: (r) => r.additionalDetails?.height },
  { key: "weight", header: "Weight", get: (r) => r.additionalDetails?.weight },
  { key: "eyeSight", header: "Eye Sight", get: (r) => r.additionalDetails?.eyeSight },
  { key: "eyeColor", header: "Eye Color", get: (r) => r.additionalDetails?.eyeColor },
  { key: "hearing", header: "Hearing", get: (r) => r.additionalDetails?.hearing },
  { key: "willingToWorkAnywhere", header: "Willing To Work Anywhere", get: (r) => r.additionalDetails?.willingToWorkAnywhere },
  { key: "joiningTimeline", header: "Joining Timeline", get: (r) => r.additionalDetails?.joiningTimeline },
  { key: "previousEmployer", header: "Previous Employer", get: (r) => r.additionalDetails?.previousEmployer },
  { key: "uanNo", header: "UAN No", get: (r) => r.additionalDetails?.uanNo },
  { key: "esicNumber", header: "ESIC Number", get: (r) => r.additionalDetails?.esicNumber },
  { key: "ifscCode", header: "IFSC Code", get: (r) => r.additionalDetails?.ifscCode },
  { key: "drivingLicenseNumber", header: "Driving License No", get: (r) => r.additionalDetails?.drivingLicenseNumber },
  { key: "drivingLicenseValidityDate", header: "DL Validity", get: (r) => r.additionalDetails?.drivingLicenseValidityDate },
  { key: "declarationPlace", header: "Declaration Place", get: (r) => r.declaration?.place },
  { key: "declarationSignedAt", header: "Declaration Signed At", get: (r) => r.declaration?.signedAt },
];

export function buildRegistrationsExcelXml(rows: RegistrationExportSource[]): string {
  const headerCells = COLUMNS.map(
    (c) => `<Cell><Data ss:Type="String">${escapeXml(c.header)}</Data></Cell>`
  ).join("");

  const body = rows
    .map((row) => {
      const cells = COLUMNS.map((c) => {
        const raw = c.get(row);
        const text = flattenValue(raw);
        return `<Cell><Data ss:Type="String">${escapeXml(text)}</Data></Cell>`;
      }).join("");
      return `<Row>${cells}</Row>`;
    })
    .join("");

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Worksheet ss:Name="Registrations">
  <Table>
   <Row>${headerCells}</Row>
   ${body}
  </Table>
 </Worksheet>
</Workbook>`;
}

export function getExportPreviewRows(
  sources: RegistrationExportSource[],
  limit = 25
): {
  count: number;
  columns: string[];
  rows: Record<string, string>[];
} {
  const previewSources = sources.slice(0, limit);
  const columns = COLUMNS.map((c) => c.header);
  const rows = previewSources.map((source) => {
    const row: Record<string, string> = {};
    for (const col of COLUMNS) {
      row[col.header] = flattenValue(col.get(source));
    }
    return row;
  });
  return { count: sources.length, columns, rows };
}
