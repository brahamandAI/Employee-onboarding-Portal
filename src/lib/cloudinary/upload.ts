import { Readable } from "stream";
import { getCloudinary, getCloudinaryFolder } from "@/lib/cloudinary/config";
import { DocumentType } from "@/features/onboarding/constants";
import { normalizeMimeType } from "@/lib/files/mime";

export interface CloudinaryUploadResult {
  url: string;
  bytes: number;
  format: string;
}

function getResourceType(mimeType: string): "image" | "raw" {
  return mimeType === "application/pdf" ? "raw" : "image";
}

function uploadBuffer(
  buffer: Buffer,
  options: {
    folder: string;
    publicId: string;
    mimeType: string;
  }
): Promise<CloudinaryUploadResult> {
  const cloudinary = getCloudinary();
  const resourceType = getResourceType(options.mimeType);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: options.publicId,
        resource_type: resourceType,
        overwrite: false,
        unique_filename: true,
        ...(resourceType === "raw" ? { format: "pdf" } : {}),
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url) {
          reject(new Error("Cloudinary upload did not return a secure URL"));
          return;
        }

        resolve({
          url: result.secure_url,
          bytes: result.bytes ?? buffer.length,
          format: result.format ?? "unknown",
        });
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

export async function uploadDocumentToCloudinary(
  buffer: Buffer,
  applicationRef: string,
  documentType: DocumentType,
  fileName: string,
  reportedMimeType: string
): Promise<CloudinaryUploadResult> {
  const mimeType = normalizeMimeType(fileName, reportedMimeType);
  const folder = getCloudinaryFolder(applicationRef);
  const publicId = `${documentType.toLowerCase()}_${Date.now()}`;

  return uploadBuffer(buffer, { folder, publicId, mimeType });
}

export async function uploadIdCardToCloudinary(
  buffer: Buffer,
  applicationRef: string,
  employeeIdCode: string
): Promise<CloudinaryUploadResult> {
  const folder = `${getCloudinaryFolder(applicationRef)}/id-cards`;
  const publicId = `id_card_${employeeIdCode.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}`;

  return uploadBuffer(buffer, {
    folder,
    publicId,
    mimeType: "application/pdf",
  });
}

export async function deleteDocumentFromCloudinary(url: string): Promise<void> {
  const cloudinary = getCloudinary();

  try {
    const publicId = extractPublicIdFromUrl(url);
    if (!publicId) return;

    const resourceType = url.includes("/raw/upload/") ? "raw" : "image";
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
  } catch {
    // Asset may already be removed
  }
}

/** Extract Cloudinary public_id from a secure delivery URL */
export function extractPublicIdFromUrl(url: string): string | null {
  const uploadMarker = "/upload/";
  const idx = url.indexOf(uploadMarker);
  if (idx === -1) return null;

  let path = url.slice(idx + uploadMarker.length);
  path = path.replace(/^v\d+\//, "");
  // Keep extension for raw assets that include it in public_id; strip for images
  if (url.includes("/image/upload/")) {
    return path.replace(/\.[^/.]+$/, "") || null;
  }
  return path || null;
}

export async function moveDocumentInCloudinary(params: {
  sourceUrl: string;
  targetFolder: string;
  targetPublicId: string;
  mimeType: string;
}): Promise<{ url: string; publicId: string } | null> {
  const cloudinary = getCloudinary();
  const fromPublicId = extractPublicIdFromUrl(params.sourceUrl);
  if (!fromPublicId) return null;

  const resourceType = getResourceType(params.mimeType);
  const toPublicId = `${params.targetFolder}/${params.targetPublicId}`.replace(
    /\/+/g,
    "/"
  );

  try {
    const result = await cloudinary.uploader.rename(fromPublicId, toPublicId, {
      resource_type: resourceType,
      overwrite: true,
      invalidate: true,
    });

    const url =
      (result as { secure_url?: string }).secure_url ||
      buildDeliveryUrl(toPublicId, resourceType);

    return { url, publicId: toPublicId };
  } catch {
    // Rename may fail for some raw assets — fall back to copy via upload
    try {
      const response = await fetch(params.sourceUrl);
      if (!response.ok) return null;
      const buffer = Buffer.from(await response.arrayBuffer());
      const uploaded = await uploadBuffer(buffer, {
        folder: params.targetFolder,
        publicId: params.targetPublicId,
        mimeType: params.mimeType,
      });
      return { url: uploaded.url, publicId: `${params.targetFolder}/${params.targetPublicId}` };
    } catch {
      return null;
    }
  }
}

function buildDeliveryUrl(publicId: string, resourceType: "image" | "raw"): string {
  const cloudinary = getCloudinary();
  const cloudName = cloudinary.config().cloud_name;
  const typePath = resourceType === "raw" ? "raw" : "image";
  return `https://res.cloudinary.com/${cloudName}/${typePath}/upload/${publicId}`;
}
