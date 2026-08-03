import { v2 as cloudinary } from "cloudinary";

let configured = false;

interface CloudinaryCredentials {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

function parseCloudinaryUrl(url: string): CloudinaryCredentials | null {
  const normalized = url.trim().replace(/^cloudinary:\/\//, "https://");

  try {
    const parsed = new URL(normalized);
    const api_key = decodeURIComponent(parsed.username);
    const api_secret = decodeURIComponent(parsed.password);
    const cloud_name = parsed.hostname;

    if (!api_key || !api_secret || !cloud_name) {
      return null;
    }

    return { cloud_name, api_key, api_secret };
  } catch {
    return null;
  }
}

function isPlaceholderSecret(secret: string | undefined): boolean {
  if (!secret) return true;
  const trimmed = secret.trim();
  return trimmed.length === 0 || /^\*+$/.test(trimmed);
}

function resolveCloudinaryCredentials(): CloudinaryCredentials {
  const fromUrl = process.env.CLOUDINARY_URL
    ? parseCloudinaryUrl(process.env.CLOUDINARY_URL)
    : null;

  const cloud_name =
    process.env.CLOUDINARY_CLOUD_NAME?.trim() || fromUrl?.cloud_name;
  const api_key = process.env.CLOUDINARY_API_KEY?.trim() || fromUrl?.api_key;

  const explicitSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  const api_secret = isPlaceholderSecret(explicitSecret)
    ? fromUrl?.api_secret
    : explicitSecret;

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local."
    );
  }

  return { cloud_name, api_key, api_secret };
}

export function getCloudinary() {
  if (!configured) {
    const credentials = resolveCloudinaryCredentials();

    cloudinary.config({
      cloud_name: credentials.cloud_name,
      api_key: credentials.api_key,
      api_secret: credentials.api_secret,
      secure: true,
    });

    configured = true;
  }

  return cloudinary;
}

export function getCloudinaryFolder(applicationRef: string): string {
  return `rakshak-eoms/applications/${applicationRef}`;
}

/** Master root for post-approval employee document folders */
export const EMPLOYEE_DOCUMENTS_MASTER_FOLDER = "Employee Documents";

export function getEmployeeDocumentsCloudinaryRoot(): string {
  return `rakshak-eoms/${EMPLOYEE_DOCUMENTS_MASTER_FOLDER}`;
}

export function sanitizeFolderSegment(value: string): string {
  return value
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}
