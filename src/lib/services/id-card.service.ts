import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Employee } from "@/lib/db/models/Employee";
import { EmployeeDocument } from "@/lib/db/models/EmployeeDocument";
import { IdCard } from "@/lib/db/models/IdCard";
import { IdCardDownloadLog } from "@/lib/db/models/IdCardDownloadLog";
import { EmployeeStatus, UserRole } from "@/types/enums";
import { DocumentType } from "@/features/onboarding/constants";
import { generateIdCardPdf } from "@/lib/services/id-card-pdf.service";
import { uploadIdCardToCloudinary } from "@/lib/cloudinary/upload";
import {
  buildEmployeeQrPayload,
  generateQrCodeDataUrl,
  serializeQrPayload,
} from "@/lib/services/qr-code.service";
import {
  dispatchIdCardGenerated,
  employeeNotifyContext,
} from "@/lib/services/notification-dispatch.service";

export class IdCardError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "IdCardError";
  }
}

export interface IdCardPreviewData {
  employeeId: string;
  applicationRef: string;
  employeeIdCode: string;
  fullName: string;
  designation?: string;
  department?: string;
  branch?: string;
  postAppliedFor?: string;
  phone: string;
  email: string;
  photoUrl?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  address?: string;
  issueDate?: string;
  expiryDate?: string;
  qrCodeDataUrl?: string;
  status: EmployeeStatus;
  hasActiveIdCard: boolean;
  idCardUrl?: string;
  idCardId?: string;
  cardStatus?: string;
  completedAt?: string;
}

export interface EmployeeIdCardData {
  employeeId: string;
  applicationRef: string;
  employeeIdCode: string;
  fullName: string;
  designation?: string;
  department?: string;
  branch?: string;
  postAppliedFor?: string;
  phone: string;
  email: string;
  photoUrl?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  address?: string;
  status: EmployeeStatus;
}

function addYears(date: Date, years: number): Date {
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + years);
  return next;
}

async function logAction(params: {
  idCardId?: string;
  employeeId: string;
  employeeIdCode: string;
  employeeName: string;
  action: "PREVIEW" | "DOWNLOAD" | "GENERATE" | "COMPLETE" | "PRINT";
  performedBy: string;
  performedByRole: string;
}) {
  await IdCardDownloadLog.create({
    idCardId: params.idCardId
      ? new mongoose.Types.ObjectId(params.idCardId)
      : undefined,
    employeeId: new mongoose.Types.ObjectId(params.employeeId),
    employeeIdCode: params.employeeIdCode,
    employeeName: params.employeeName,
    action: params.action,
    performedBy: new mongoose.Types.ObjectId(params.performedBy),
    performedByRole: params.performedByRole,
  });
}

function extractPersonalDetails(employee: { personalDetails?: Record<string, unknown> }) {
  const personal = employee.personalDetails as {
    fullName?: string;
    postAppliedFor?: string;
    bloodGroup?: string;
    dateOfBirth?: string;
  } | undefined;

  return {
    fullName: personal?.fullName ?? "Unknown",
    postAppliedFor: personal?.postAppliedFor,
    bloodGroup: personal?.bloodGroup,
    dateOfBirth: personal?.dateOfBirth,
  };
}

function extractAddress(employee: { address?: Record<string, unknown> }) {
  const addr = employee.address as {
    localAddress?: string;
    permanentAddress?: string;
    present?: Record<string, string>;
    permanent?: Record<string, string>;
  } | undefined;

  if (addr?.localAddress) return addr.localAddress;
  if (addr?.permanentAddress) return addr.permanentAddress;

  const present = addr?.present;
  if (present) {
    return [
      present.houseNo,
      present.street,
      present.villageOrCity,
      present.district,
      present.state,
      present.pincode,
    ]
      .filter(Boolean)
      .join(", ");
  }

  return undefined;
}

function deriveDepartment(postAppliedFor?: string): string {
  if (!postAppliedFor) return "—";
  return postAppliedFor;
}

function deriveBranch(employee: {
  address?: Record<string, unknown>;
}): string {
  const addr = employee.address as { localAddress?: string } | undefined;
  const local = addr?.localAddress ?? "";
  const districtMatch = local.match(/,\s*([^,]+),\s*\d{6}/);
  if (districtMatch?.[1]) return districtMatch[1].trim();
  return "—";
}

/** Fetch all employee data required for ID card generation. */
export async function fetchEmployeeDataForIdCard(
  employeeId: string
): Promise<EmployeeIdCardData | null> {
  await connectDB();

  const employee = await Employee.findById(employeeId).lean();
  if (!employee || !employee.employeeId) return null;

  const photo = await EmployeeDocument.findOne({
    employeeId,
    documentType: DocumentType.PHOTO,
    isActive: true,
  }).lean();

  const personal = extractPersonalDetails(employee);
  const designation = personal.postAppliedFor;
  const department = deriveDepartment(designation);
  const branch = deriveBranch(employee);

  return {
    employeeId: String(employee._id),
    applicationRef: employee.applicationRef,
    employeeIdCode: employee.employeeId,
    fullName: personal.fullName,
    designation,
    department,
    branch,
    postAppliedFor: personal.postAppliedFor,
    phone: employee.phone,
    email: employee.email,
    photoUrl: photo?.url,
    bloodGroup: personal.bloodGroup,
    dateOfBirth: personal.dateOfBirth,
    address: extractAddress(employee),
    status: employee.status,
  };
}

async function buildQrDataUrl(data: EmployeeIdCardData, issueDate: Date): Promise<string> {
  const payload = buildEmployeeQrPayload({
    employeeIdCode: data.employeeIdCode,
    fullName: data.fullName,
    designation: data.designation,
    department: data.department,
    branch: data.branch,
    bloodGroup: data.bloodGroup,
    issueDate: issueDate.toISOString(),
    status: "ACTIVE",
  });
  return generateQrCodeDataUrl(serializeQrPayload(payload), 160);
}

export async function getIdCardPreviewData(
  employeeId: string
): Promise<IdCardPreviewData | null> {
  const data = await fetchEmployeeDataForIdCard(employeeId);
  if (!data) return null;

  await connectDB();
  const activeCard = await IdCard.findOne({
    employeeId,
    status: "ACTIVE",
  }).lean();

  const issueDate = activeCard?.issueDate ?? new Date();
  const expiryDate = activeCard?.expiryDate ?? addYears(issueDate, 2);
  const qrCodeDataUrl = await buildQrDataUrl(data, issueDate);

  return {
    ...data,
    issueDate: issueDate.toISOString(),
    expiryDate: expiryDate.toISOString(),
    qrCodeDataUrl,
    hasActiveIdCard: !!activeCard,
    idCardUrl: activeCard?.downloadUrl ?? activeCard?.url,
    idCardId: activeCard ? String(activeCard._id) : undefined,
    cardStatus: activeCard?.cardStatus,
    completedAt: activeCard?.completedAt?.toISOString(),
  };
}

export async function recordIdCardPreview(
  employeeId: string,
  supportUserId: string
): Promise<void> {
  await connectDB();
  const employee = await Employee.findById(employeeId);
  if (!employee?.employeeId) {
    throw new IdCardError("Employee not found or missing ID", "NOT_FOUND");
  }

  const { fullName } = extractPersonalDetails(employee);
  const activeCard = await IdCard.findOne({ employeeId, status: "ACTIVE" });

  await logAction({
    idCardId: activeCard?._id.toString(),
    employeeId,
    employeeIdCode: employee.employeeId,
    employeeName: fullName,
    action: "PREVIEW",
    performedBy: supportUserId,
    performedByRole: UserRole.SUPPORT,
  });
}

export async function generateIdCardForEmployee(
  employeeId: string,
  supportUserId: string
): Promise<{ idCardId: string; url: string }> {
  await connectDB();

  const data = await fetchEmployeeDataForIdCard(employeeId);
  if (!data) {
    throw new IdCardError("Employee not found or missing employee ID", "NOT_FOUND");
  }

  const allowed = [EmployeeStatus.ID_GENERATED, EmployeeStatus.APPROVED];
  if (!allowed.includes(data.status) && data.status !== EmployeeStatus.ID_CARD_ISSUED) {
    throw new IdCardError(
      "Employee is not eligible for ID card generation",
      "INVALID_STATUS"
    );
  }

  const issueDate = new Date();
  const expiryDate = addYears(issueDate, 2);

  const qrCodeDataUrl = await buildQrDataUrl(data, issueDate);

  const pdfBuffer = await generateIdCardPdf({
    fullName: data.fullName,
    employeeIdCode: data.employeeIdCode,
    designation: data.designation,
    department: data.department,
    branch: data.branch,
    bloodGroup: data.bloodGroup,
    dateOfBirth: data.dateOfBirth,
    address: data.address,
    photoUrl: data.photoUrl,
    issueDate,
    expiryDate,
    status: "ACTIVE",
  });

  const upload = await uploadIdCardToCloudinary(
    pdfBuffer,
    data.applicationRef,
    data.employeeIdCode
  );

  await IdCard.updateMany(
    { employeeId, status: "ACTIVE" },
    { status: "SUPERSEDED", cardStatus: "SUPERSEDED" }
  );

  const idCard = await IdCard.create({
    employeeId: new mongoose.Types.ObjectId(employeeId),
    employeeIdCode: data.employeeIdCode,
    employeeName: data.fullName,
    photoUrl: data.photoUrl,
    designation: data.designation,
    department: data.department,
    branch: data.branch,
    bloodGroup: data.bloodGroup,
    dateOfBirth: data.dateOfBirth,
    address: data.address,
    qrCodeUrl: qrCodeDataUrl,
    issueDate,
    expiryDate,
    url: upload.url,
    downloadUrl: upload.url,
    format: "PDF",
    status: "ACTIVE",
    cardStatus: "GENERATED",
    generatedBy: new mongoose.Types.ObjectId(supportUserId),
    generatedAt: issueDate,
  });

  await logAction({
    idCardId: idCard._id.toString(),
    employeeId,
    employeeIdCode: data.employeeIdCode,
    employeeName: data.fullName,
    action: "GENERATE",
    performedBy: supportUserId,
    performedByRole: UserRole.SUPPORT,
  });

  return { idCardId: idCard._id.toString(), url: upload.url };
}

export async function recordIdCardDownload(
  idCardId: string,
  supportUserId: string
): Promise<{ url: string; fileName: string }> {
  await connectDB();
  const idCard = await IdCard.findById(idCardId);
  if (!idCard || idCard.status !== "ACTIVE") {
    throw new IdCardError("ID card not found", "NOT_FOUND");
  }

  const employee = await Employee.findById(idCard.employeeId);
  if (!employee) throw new IdCardError("Employee not found", "NOT_FOUND");

  const { fullName } = extractPersonalDetails(employee);

  await logAction({
    idCardId,
    employeeId: String(employee._id),
    employeeIdCode: idCard.employeeIdCode,
    employeeName: fullName,
    action: "DOWNLOAD",
    performedBy: supportUserId,
    performedByRole: UserRole.SUPPORT,
  });

  const fileName = `ID-Card-${idCard.employeeIdCode.replace(/[^a-zA-Z0-9-]/g, "_")}.pdf`;

  return { url: idCard.downloadUrl ?? idCard.url, fileName };
}

export async function getIdCardDownloadUrl(idCardId: string): Promise<{
  url: string;
  fileName: string;
} | null> {
  await connectDB();
  const idCard = await IdCard.findById(idCardId).lean();
  if (!idCard || idCard.status !== "ACTIVE") return null;

  return {
    url: idCard.downloadUrl ?? idCard.url,
    fileName: `ID-Card-${idCard.employeeIdCode.replace(/[^a-zA-Z0-9-]/g, "_")}.pdf`,
  };
}

export async function markIdCardCompleted(
  employeeId: string,
  supportUserId: string
): Promise<void> {
  await connectDB();
  const employee = await Employee.findById(employeeId);
  if (!employee) throw new IdCardError("Employee not found", "NOT_FOUND");

  const activeCard = await IdCard.findOne({ employeeId, status: "ACTIVE" });
  if (!activeCard) {
    throw new IdCardError("Generate ID card before marking completed", "NO_ID_CARD");
  }

  employee.status = EmployeeStatus.ID_CARD_ISSUED;
  await employee.save();

  activeCard.completedAt = new Date();
  activeCard.completedBy = new mongoose.Types.ObjectId(supportUserId);
  activeCard.cardStatus = "COMPLETED";
  await activeCard.save();

  const { fullName } = extractPersonalDetails(employee);

  await logAction({
    idCardId: activeCard._id.toString(),
    employeeId,
    employeeIdCode: activeCard.employeeIdCode,
    employeeName: fullName,
    action: "COMPLETE",
    performedBy: supportUserId,
    performedByRole: UserRole.SUPPORT,
  });

  await dispatchIdCardGenerated(
    employeeNotifyContext({
      _id: employee._id,
      applicationRef: employee.applicationRef,
      employeeId: employee.employeeId,
      personalDetails: employee.personalDetails as Record<string, unknown>,
    })
  );
}
