const EXTENSION_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  jfif: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  pdf: "application/pdf",
};

const ALLOWED_MIMES = new Set(Object.values(EXTENSION_MIME));

export function getExtension(fileName: string): string {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? parts[parts.length - 1]! : "";
}

export function normalizeMimeType(fileName: string, reportedType?: string): string {
  const trimmed = reportedType?.trim().toLowerCase() ?? "";

  if (trimmed === "image/jpg") {
    return "image/jpeg";
  }

  if (trimmed && ALLOWED_MIMES.has(trimmed)) {
    return trimmed;
  }

  const fromExtension = EXTENSION_MIME[getExtension(fileName)];
  if (fromExtension) {
    return fromExtension;
  }

  return trimmed;
}

export function isAllowedUpload(fileName: string, reportedType?: string): boolean {
  return ALLOWED_MIMES.has(normalizeMimeType(fileName, reportedType));
}

export const ACCEPTED_FILE_EXTENSIONS = ".jpg,.jpeg,.jfif,.png,.webp,.pdf";

export const ACCEPTED_MIME_TYPES = Array.from(ALLOWED_MIMES);
