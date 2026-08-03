"use client";

import {
  DocumentType,
  DOCUMENT_LABELS,
  DOCUMENT_DESCRIPTIONS,
  UPLOAD_DOCUMENT_TYPES,
  getRequiredDocuments,
} from "@/features/onboarding/constants";
import { DocumentRecord } from "@/features/onboarding/types";
import { FileUploadField } from "@/features/onboarding/components/FileUploadField";
import { FormSection } from "@/features/onboarding/components/FormSection";

interface StepProps {
  documents: DocumentRecord[];
  onDocumentsChange: (documents: DocumentRecord[]) => void;
  isExServiceman?: boolean;
  isGunman?: boolean;
}

export function DocumentsStep({
  documents,
  onDocumentsChange,
  isExServiceman = false,
  isGunman = false,
}: StepProps) {
  function getDoc(type: DocumentType) {
    return documents.find((d) => d.documentType === type);
  }

  function handleUploaded(doc: DocumentRecord) {
    onDocumentsChange([
      ...documents.filter((d) => d.documentType !== doc.documentType),
      doc,
    ]);
  }

  function handleDeleted(type: DocumentType) {
    onDocumentsChange(documents.filter((d) => d.documentType !== type));
  }

  const requiredDocs = getRequiredDocuments({ isExServiceman, isGunman });
  const missingRequired = requiredDocs.filter((t) => !getDoc(t));

  const visibleTypes = UPLOAD_DOCUMENT_TYPES.filter((type) => {
    if (type === DocumentType.DISCHARGE_BOOK) return isExServiceman;
    if (type === DocumentType.GUN_LICENSE) return isGunman;
    return true;
  });

  return (
    <FormSection
      sectionNumber={6}
      title="Document Upload"
      subtitle="Upload clear copies of all required documents. PDF, PNG, JPG, JPEG — max 5 MB each."
    >
      <div className="space-y-6">
        <p className="text-sm text-[#64748B]">
          Preview is shown before upload. Documents are stored securely in Cloudinary.
        </p>

        {(isExServiceman || isGunman) && (
          <p className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Based on your Additional Particulars selection,
            {isExServiceman ? " Discharge Book" : ""}
            {isExServiceman && isGunman ? " and" : ""}
            {isGunman ? " Gun License" : ""}{" "}
            {isExServiceman && isGunman ? "are" : "is"} mandatory below.
          </p>
        )}

        {missingRequired.length > 0 && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Still required: {missingRequired.map((t) => DOCUMENT_LABELS[t]).join(", ")}
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {visibleTypes.map((type) => (
            <FileUploadField
              key={type}
              documentType={type}
              description={DOCUMENT_DESCRIPTIONS[type]}
              existing={getDoc(type)}
              required={requiredDocs.includes(type)}
              onUploaded={handleUploaded}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      </div>
    </FormSection>
  );
}
