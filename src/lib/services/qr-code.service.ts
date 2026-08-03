import QRCode from "qrcode";

export interface EmployeeQrPayload {
  employeeNumber: string;
  employeeName: string;
  designation?: string;
  department?: string;
  branch?: string;
  bloodGroup?: string;
  issueDate?: string;
  status: string;
  verifyUrl: string;
}

export function buildEmployeeQrPayload(params: {
  employeeIdCode: string;
  fullName: string;
  designation?: string;
  department?: string;
  branch?: string;
  bloodGroup?: string;
  issueDate?: string;
  status?: string;
}): EmployeeQrPayload {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return {
    employeeNumber: params.employeeIdCode,
    employeeName: params.fullName,
    designation: params.designation,
    department: params.department,
    branch: params.branch,
    bloodGroup: params.bloodGroup,
    issueDate: params.issueDate,
    status: params.status ?? "ACTIVE",
    verifyUrl: `${baseUrl}/verify/${encodeURIComponent(params.employeeIdCode)}`,
  };
}

export function serializeQrPayload(payload: EmployeeQrPayload): string {
  return JSON.stringify(payload);
}

export async function generateQrCodeBuffer(data: string, size = 120): Promise<Buffer> {
  return QRCode.toBuffer(data, {
    type: "png",
    width: size,
    margin: 1,
    color: { dark: "#000000", light: "#FFFFFF" },
    errorCorrectionLevel: "M",
  });
}

export async function generateQrCodeDataUrl(data: string, size = 120): Promise<string> {
  return QRCode.toDataURL(data, {
    width: size,
    margin: 1,
    color: { dark: "#000000", light: "#FFFFFF" },
    errorCorrectionLevel: "M",
  });
}
