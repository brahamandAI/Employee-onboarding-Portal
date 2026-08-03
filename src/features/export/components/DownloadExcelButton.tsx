"use client";

import { useState } from "react";
import { Download, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadExcelButtonProps {
  scope: "l1" | "l2" | "admin";
  label?: string;
}

interface PreviewData {
  count: number;
  columns: string[];
  rows: Record<string, string>[];
}

export function DownloadExcelButton({
  scope,
  label = "Download Excel",
}: DownloadExcelButtonProps) {
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewData | null>(null);

  async function loadPreview() {
    setPreviewLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/export/registrations?scope=${scope}&preview=1`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to load preview");
      }
      const data = (await res.json()) as PreviewData;
      setPreview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preview failed");
    } finally {
      setPreviewLoading(false);
    }
  }

  async function handleDownload() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/export/registrations?scope=${scope}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to download Excel");
      }
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? `registrations-${scope}.xls`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setLoading(false);
    }
  }

  const previewColumns = preview?.columns.slice(0, 12) ?? [];

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={loadPreview}
          isLoading={previewLoading}
        >
          <Eye className="h-4 w-4" />
          Preview Excel
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDownload}
          isLoading={loading}
        >
          <Download className="h-4 w-4" />
          {label}
        </Button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3">
              <div>
                <h3 className="font-heading text-lg font-semibold text-primary">
                  Excel Preview
                </h3>
                <p className="text-xs text-[#64748B]">
                  Showing {preview.rows.length} of {preview.count} registration
                  {preview.count === 1 ? "" : "s"}
                  {scope === "admin" ? " (L2 approved only)" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleDownload}
                  isLoading={loading}
                >
                  <Download className="h-4 w-4" />
                  Download Excel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setPreview(null)}
                >
                  <X className="h-4 w-4" />
                  Close
                </Button>
              </div>
            </div>
            <div className="overflow-auto p-4">
              {preview.count === 0 ? (
                <p className="text-sm text-[#64748B]">No registrations to export.</p>
              ) : (
                <table className="min-w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                      {previewColumns.map((col) => (
                        <th
                          key={col}
                          className="whitespace-nowrap px-2 py-2 font-medium text-[#64748B]"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows.map((row, idx) => (
                      <tr key={idx} className="border-b border-[#E2E8F0]">
                        {previewColumns.map((col) => (
                          <td
                            key={col}
                            className="max-w-[180px] truncate px-2 py-2 text-[#0F172A]"
                            title={row[col]}
                          >
                            {row[col] || "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {preview.columns.length > previewColumns.length && (
                <p className="mt-3 text-xs text-[#64748B]">
                  Preview shows first {previewColumns.length} columns. Full Excel file includes all{" "}
                  {preview.columns.length} columns and complete form details.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
