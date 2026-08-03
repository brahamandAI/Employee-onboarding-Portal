import { connectDB } from "@/lib/db/connect";
import { Employee } from "@/lib/db/models/Employee";
import { EmployeeDocument } from "@/lib/db/models/EmployeeDocument";
import {
  DOCUMENT_LABELS,
  DocumentType,
} from "@/features/onboarding/constants";
import {
  EMPLOYEE_DOCUMENTS_MASTER_FOLDER,
  getEmployeeDocumentsCloudinaryRoot,
  sanitizeFolderSegment,
} from "@/lib/cloudinary/config";
import { moveDocumentInCloudinary } from "@/lib/cloudinary/upload";
import { EmployeeStatus, UserRole, StaffRole } from "@/types/enums";

export interface DocumentsFolderInfo {
  folderName: string;
  folderPath: string;
  cloudinaryFolder: string;
  documentCount: number;
  temporaryEmployeeId: string;
  employeeName: string;
  organizedAt: string;
}

export interface FolderDocumentItem {
  _id: string;
  documentType: string;
  label: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  folderRelativePath: string;
  url: string;
}

function buildFolderName(temporaryEmployeeId: string, employeeName: string): string {
  const idPart = sanitizeFolderSegment(temporaryEmployeeId);
  const namePart = sanitizeFolderSegment(employeeName || "Employee");
  return `${idPart} - ${namePart}`;
}

function sanitizeFileBase(fileName: string): string {
  const base = fileName.replace(/[\\/:*?"<>|]+/g, "-").trim();
  return base || `document_${Date.now()}`;
}

function extensionFromFileName(fileName: string, mimeType: string): string {
  const match = fileName.match(/(\.[a-zA-Z0-9]+)$/);
  if (match) return match[1];
  if (mimeType === "application/pdf") return ".pdf";
  if (mimeType.includes("png")) return ".png";
  if (mimeType.includes("webp")) return ".webp";
  return ".jpg";
}

/**
 * After L2 approval + temporary employee ID generation, create the logical
 * Employee Documents folder and move/copy Cloudinary assets into it.
 */
export async function organizeEmployeeDocumentsFolder(
  employeeId: string
): Promise<DocumentsFolderInfo | null> {
  await connectDB();
  const employee = await Employee.findById(employeeId);
  if (!employee) return null;

  const temporaryEmployeeId =
    employee.temporaryEmployeeId || employee.employeeId;
  if (!temporaryEmployeeId) return null;

  // Idempotent: if folder already organized, refresh count and return
  if (employee.documentsFolder?.folderPath && employee.documentsFolder.folderName) {
    const count = await EmployeeDocument.countDocuments({
      employeeId: employee._id,
      isActive: true,
    });
    if (employee.documentsFolder.documentCount !== count) {
      employee.documentsFolder.documentCount = count;
      await employee.save();
    }
    return {
      folderName: employee.documentsFolder.folderName,
      folderPath: employee.documentsFolder.folderPath,
      cloudinaryFolder: employee.documentsFolder.cloudinaryFolder,
      documentCount: count,
      temporaryEmployeeId: employee.documentsFolder.temporaryEmployeeId,
      employeeName: employee.documentsFolder.employeeName,
      organizedAt: new Date(employee.documentsFolder.organizedAt).toISOString(),
    };
  }

  const personal = (employee.personalDetails ?? {}) as { fullName?: string };
  const employeeName = personal.fullName?.trim() || "Employee";
  const folderName = buildFolderName(temporaryEmployeeId, employeeName);
  const folderPath = `${EMPLOYEE_DOCUMENTS_MASTER_FOLDER}/${folderName}`;
  const cloudinaryFolder = `${getEmployeeDocumentsCloudinaryRoot()}/${folderName}`;

  const docs = await EmployeeDocument.find({
    employeeId: employee._id,
    isActive: true,
  });

  for (const doc of docs) {
    const label =
      DOCUMENT_LABELS[doc.documentType as DocumentType] ?? doc.documentType;
    const labelFolder = sanitizeFolderSegment(label);
    const originalBase = sanitizeFileBase(doc.fileName);
    const ext = extensionFromFileName(doc.fileName, doc.mimeType);
    const publicIdBase = originalBase.replace(/\.[^/.]+$/, "");
    const targetPublicId = `${labelFolder}/${publicIdBase}`;

    const moved = await moveDocumentInCloudinary({
      sourceUrl: doc.url,
      targetFolder: cloudinaryFolder,
      targetPublicId,
      mimeType: doc.mimeType,
    });

    doc.folderLabel = label;
    doc.folderRelativePath = `${labelFolder}/${originalBase.endsWith(ext) ? originalBase : `${publicIdBase}${ext}`}`;

    if (moved?.url) {
      doc.url = moved.url;
    }

    await doc.save();
  }

  const documentCount = docs.length;
  employee.documentsFolder = {
    folderName,
    folderPath,
    cloudinaryFolder,
    documentCount,
    temporaryEmployeeId,
    employeeName,
    organizedAt: new Date(),
  };
  await employee.save();

  return {
    folderName,
    folderPath,
    cloudinaryFolder,
    documentCount,
    temporaryEmployeeId,
    employeeName,
    organizedAt: new Date().toISOString(),
  };
}

function isPostL2Approved(status: EmployeeStatus, employee: {
  forwardedToAdminAt?: Date;
  forwardedToSupportAt?: Date;
  temporaryEmployeeId?: string;
  l2Decision?: { action?: string };
}): boolean {
  if (employee.temporaryEmployeeId) return true;
  if (employee.forwardedToAdminAt || employee.forwardedToSupportAt) return true;
  if (employee.l2Decision?.action === "APPROVE" || employee.l2Decision?.action === "FORWARD") {
    return true;
  }
  return [
    EmployeeStatus.APPROVED,
    EmployeeStatus.ID_GENERATED,
    EmployeeStatus.ID_CARD_ISSUED,
  ].includes(status);
}

export function canAccessDocumentsFolder(params: {
  role: StaffRole;
  userId: string;
  employee: {
    status: EmployeeStatus;
    submittedBy?: { toString(): string } | string;
    temporaryEmployeeId?: string;
    forwardedToAdminAt?: Date;
    forwardedToSupportAt?: Date;
    l2Decision?: { action?: string };
    documentsFolder?: unknown;
  };
}): { allowed: boolean; canDownloadZip: boolean; readOnly: boolean; reason?: string } {
  const { role, userId, employee } = params;
  const postApproved = isPostL2Approved(employee.status, employee);

  if (role === UserRole.ADMIN) {
    return { allowed: true, canDownloadZip: true, readOnly: true };
  }

  if (role === UserRole.SUPPORT) {
    if (!postApproved) {
      return {
        allowed: false,
        canDownloadZip: false,
        readOnly: true,
        reason: "Support can access folders only after L2 approval",
      };
    }
    return { allowed: true, canDownloadZip: true, readOnly: true };
  }

  if (role === UserRole.L2) {
    // Pending L2 review OR post-approval folder view
    const pending =
      employee.status === EmployeeStatus.L2_REVIEW ||
      employee.l2Decision?.action === "APPROVE" ||
      postApproved;
    if (!pending && !postApproved) {
      return {
        allowed: false,
        canDownloadZip: false,
        readOnly: true,
        reason: "Not authorized for this registration",
      };
    }
    return { allowed: true, canDownloadZip: true, readOnly: true };
  }

  if (role === UserRole.L1) {
    const reviewing = [
      EmployeeStatus.SUBMITTED,
      EmployeeStatus.L1_REVIEW,
    ].includes(employee.status);
    if (!reviewing && !postApproved) {
      return {
        allowed: false,
        canDownloadZip: false,
        readOnly: true,
        reason: "L1 can view documents only while reviewing pending registrations",
      };
    }
    // Folder UI mainly after L2; still allow document list during review
    return { allowed: true, canDownloadZip: false, readOnly: true };
  }

  if (role === UserRole.SUBMITTER) {
    const submittedBy =
      typeof employee.submittedBy === "string"
        ? employee.submittedBy
        : employee.submittedBy?.toString();
    if (submittedBy !== userId) {
      return {
        allowed: false,
        canDownloadZip: false,
        readOnly: true,
        reason: "Submitters can only access their own registrations",
      };
    }
    return { allowed: true, canDownloadZip: false, readOnly: true };
  }

  return {
    allowed: false,
    canDownloadZip: false,
    readOnly: true,
    reason: "Forbidden",
  };
}

export async function getEmployeeDocumentsFolder(
  employeeId: string
): Promise<{
  folder: DocumentsFolderInfo | null;
  documents: FolderDocumentItem[];
  employeeStatus: EmployeeStatus;
  submittedBy?: string;
  temporaryEmployeeId?: string;
  forwardedToAdminAt?: Date;
  forwardedToSupportAt?: Date;
  l2Decision?: { action?: string };
} | null> {
  await connectDB();
  let employee = await Employee.findById(employeeId).lean();
  if (!employee) return null;

  // Lazy organize for already-approved registrations missing a folder
  if (
    !employee.documentsFolder?.folderPath &&
    (employee.temporaryEmployeeId || employee.employeeId) &&
    isPostL2Approved(employee.status, employee)
  ) {
    await organizeEmployeeDocumentsFolder(employeeId);
    employee = await Employee.findById(employeeId).lean();
    if (!employee) return null;
  }

  const docs = await EmployeeDocument.find({
    employeeId,
    isActive: true,
  })
    .sort({ documentType: 1 })
    .lean();

  const folder = employee.documentsFolder
    ? {
        folderName: employee.documentsFolder.folderName,
        folderPath: employee.documentsFolder.folderPath,
        cloudinaryFolder: employee.documentsFolder.cloudinaryFolder,
        documentCount: employee.documentsFolder.documentCount,
        temporaryEmployeeId: employee.documentsFolder.temporaryEmployeeId,
        employeeName: employee.documentsFolder.employeeName,
        organizedAt: new Date(employee.documentsFolder.organizedAt).toISOString(),
      }
    : null;

  return {
    folder,
    documents: docs.map((d) => ({
      _id: String(d._id),
      documentType: d.documentType,
      label:
        d.folderLabel ||
        DOCUMENT_LABELS[d.documentType as DocumentType] ||
        d.documentType,
      fileName: d.fileName,
      mimeType: d.mimeType,
      sizeBytes: d.sizeBytes,
      folderRelativePath:
        d.folderRelativePath ||
        `${DOCUMENT_LABELS[d.documentType as DocumentType] || d.documentType}/${d.fileName}`,
      url: d.url,
    })),
    employeeStatus: employee.status,
    submittedBy: employee.submittedBy?.toString(),
    temporaryEmployeeId: employee.temporaryEmployeeId,
    forwardedToAdminAt: employee.forwardedToAdminAt,
    forwardedToSupportAt: employee.forwardedToSupportAt,
    l2Decision: employee.l2Decision
      ? { action: employee.l2Decision.action }
      : undefined,
  };
}
