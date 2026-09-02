import {
  DOCUMENT_LABELS,
  DocumentType,
} from "@/features/onboarding/constants";
import type { PreviewDocument } from "@/features/documents/components/DocumentPreviewGrid";

interface RawReviewDocument {
  _id: unknown;
  documentType: string;
  fileName: string;
  mimeType?: string;
  sizeBytes?: number;
  folderLabel?: string;
}

/**
 * Shapes documents loaded for an approval review into the serialisable payload
 * the client preview grid expects.
 */
export function mapReviewDocuments(
  documents: RawReviewDocument[]
): PreviewDocument[] {
  return documents.map((doc) => ({
    _id: String(doc._id),
    documentType: doc.documentType,
    label:
      doc.folderLabel ||
      DOCUMENT_LABELS[doc.documentType as DocumentType] ||
      doc.documentType,
    fileName: doc.fileName,
    mimeType: doc.mimeType ?? "application/octet-stream",
    sizeBytes: doc.sizeBytes,
  }));
}
