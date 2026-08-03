"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  FileOutput,
  Download,
  CheckCircle,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IdCardPreviewData } from "@/lib/services/id-card.service";
import { IdCardPreview } from "@/features/support/components/IdCardPreview";
import { EmployeeStatus } from "@/types/enums";
import {
  supportPreviewAction,
  supportGenerateAction,
  supportMarkCompletedAction,
} from "@/features/support/actions/support.actions";

interface SupportActionPanelProps {
  initialData: IdCardPreviewData;
}

export function SupportActionPanel({ initialData }: SupportActionPanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [data, setData] = useState(initialData);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isCompleted = data.status === EmployeeStatus.ID_CARD_ISSUED;
  const canGenerate = !isCompleted && !data.hasActiveIdCard;
  const canRegenerate = !isCompleted && data.hasActiveIdCard;
  const canDownload = !!data.idCardUrl && !!data.idCardId;
  const canMarkCompleted =
    canDownload && data.status !== EmployeeStatus.ID_CARD_ISSUED;

  function handlePreview() {
    setError(null);
    startTransition(async () => {
      const result = await supportPreviewAction(data.employeeId);
      if (result.success) {
        setShowPreview(true);
        setSuccess("Official ID card preview ready.");
      } else {
        setError(result.error);
      }
    });
  }

  function handleGenerate() {
    setError(null);
    startTransition(async () => {
      const result = await supportGenerateAction(data.employeeId);
      if (!result.success) {
        setError(result.error ?? "Generation failed");
        return;
      }
      if (result.data) {
        setData((prev) => ({
          ...prev,
          hasActiveIdCard: true,
          idCardUrl: result.data!.url as string,
          idCardId: result.data!.idCardId as string,
          cardStatus: "GENERATED",
        }));
      }
      setShowPreview(true);
      setSuccess("Employee ID card generated from official template.");
      router.refresh();
    });
  }

  function handleDownload() {
    if (!data.idCardId) return;
    setError(null);
    const link = document.createElement("a");
    link.href = `/api/id-cards/${data.idCardId}/download`;
    link.download = `ID-Card-${data.employeeIdCode}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSuccess("Download started.");
  }

  function handlePrint() {
    if (!data.idCardId) return;
    window.open(`/api/id-cards/${data.idCardId}/download?log=false`, "_blank");
    setSuccess("Print dialog opened in a new tab.");
  }

  function handleMarkCompleted() {
    setError(null);
    startTransition(async () => {
      const result = await supportMarkCompletedAction(data.employeeId);
      if (result.success) {
        setData((prev) => ({
          ...prev,
          status: EmployeeStatus.ID_CARD_ISSUED,
          cardStatus: "COMPLETED",
        }));
        setSuccess("ID card marked completed. Employee notified via portal.");
        router.refresh();
      } else {
        setError(result.error ?? "Failed to mark completed");
      }
    });
  }

  return (
    <div className="space-y-6">
      {success && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
          {success}
        </p>
      )}
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Employee ID Card Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-[#64748B]">
            Click Generate ID Card to automatically populate the official Rakshak
            Securitas template with employee data from MongoDB.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" isLoading={pending} onClick={handlePreview}>
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            {(canGenerate || canRegenerate) && (
              <Button variant="default" size="sm" isLoading={pending} onClick={handleGenerate}>
                <FileOutput className="h-4 w-4" />
                {canRegenerate ? "Regenerate ID Card" : "Generate ID Card"}
              </Button>
            )}
            {canDownload && (
              <>
                <Button variant="accent" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
              </>
            )}
            {canMarkCompleted && (
              <Button variant="default" size="sm" isLoading={pending} onClick={handleMarkCompleted}>
                <CheckCircle className="h-4 w-4" />
                Mark Completed
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {(showPreview || data.hasActiveIdCard) && (
        <div>
          <h3 className="mb-3 font-heading text-lg font-semibold text-primary">
            Official ID Card Preview
          </h3>
          <IdCardPreview data={data} />
        </div>
      )}
    </div>
  );
}
