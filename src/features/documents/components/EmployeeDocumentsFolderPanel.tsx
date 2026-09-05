"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Download,
  ExternalLink,
  FileText,
  FolderOpen,
  Loader2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FolderDoc {
  _id: string;
  documentType: string;
  label: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  folderRelativePath: string;
  downloadUrl: string;
}

interface FolderPayload {
  folder: {
    folderName: string;
    folderPath: string;
    documentCount: number;
    temporaryEmployeeId: string;
    employeeName: string;
    organizedAt: string;
  } | null;
  documents: FolderDoc[];
  permissions: {
    canDownloadZip: boolean;
    readOnly: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canReplace: boolean;
  };
}

interface EmployeeDocumentsFolderPanelProps {
  employeeId: string;
  /** Show panel even before folder is organized (e.g. still pending) */
  showWhenEmpty?: boolean;
  /** Start with the folder contents expanded */
  defaultOpen?: boolean;
}

function formatBytes(n: number) {
  if (!n) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function EmployeeDocumentsFolderPanel({
  employeeId,
  showWhenEmpty = false,
  defaultOpen = false,
}: EmployeeDocumentsFolderPanelProps) {
  const [data, setData] = useState<FolderPayload | null>(null);
  const [open, setOpen] = useState(defaultOpen);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zipLoading, setZipLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/employee-documents-folder/${employeeId}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Unable to load folder");
      }
      const json = (await res.json()) as FolderPayload;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load folder");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function downloadZip() {
    setZipLoading(true);
    try {
      const res = await fetch(`/api/employee-documents-folder/${employeeId}/zip`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "ZIP download failed");
      }
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? "employee-documents.zip";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ZIP download failed");
    } finally {
      setZipLoading(false);
    }
  }

  if (loading && !data) {
    return null;
  }

  if (error && !data) {
    return null;
  }

  if (!data?.folder && !showWhenEmpty) {
    return null;
  }

  if (!data?.folder && data?.documents.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="text-base">Employee Documents</CardTitle>
          {data?.folder ? (
            <div className="mt-2 space-y-1 text-sm text-[#64748B]">
              <p>
                <span className="font-medium text-primary">Folder Name:</span>{" "}
                {data.folder.folderName}
              </p>
              <p>
                <span className="font-medium text-primary">Folder Path:</span>{" "}
                {data.folder.folderPath}
              </p>
              <p>
                <span className="font-medium text-primary">Total Uploaded Documents:</span>{" "}
                {data.folder.documentCount}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-[#64748B]">
              Folder is created automatically after L2 approval and Temporary Employee ID
              generation. Uploaded documents are listed below once available.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setOpen((v) => !v);
              if (!open) void load();
            }}
          >
            <FolderOpen className="h-4 w-4" />
            {open ? "Close Folder" : "View Folder"}
          </Button>
          {data?.permissions.canDownloadZip && data.documents.length > 0 && (
            <Button
              type="button"
              variant="default"
              size="sm"
              isLoading={zipLoading}
              onClick={() => void downloadZip()}
            >
              <Package className="h-4 w-4" />
              Download Folder
            </Button>
          )}
        </div>
      </CardHeader>

      {open && (
        <CardContent className="space-y-3 border-t border-[#E2E8F0] pt-4">
          {data?.permissions.readOnly && (
            <p className="text-xs text-[#64748B]">
              View and download only. Documents cannot be edited, replaced, or deleted here.
            </p>
          )}
          {loading ? (
            <p className="flex items-center gap-2 text-sm text-[#64748B]">
              <Loader2 className="h-4 w-4 animate-spin" /> Refreshing…
            </p>
          ) : data && data.documents.length === 0 ? (
            <p className="text-sm text-[#64748B]">No documents in this folder.</p>
          ) : (
            <ul className="divide-y divide-[#E2E8F0] rounded-lg border border-[#E2E8F0]">
              {data?.documents.map((doc) => (
                <li
                  key={doc._id}
                  className="flex flex-wrap items-center justify-between gap-3 px-3 py-3"
                >
                  <div className="flex min-w-0 items-start gap-2">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-primary">{doc.label}</p>
                      <p className="truncate text-xs text-[#64748B]">
                        {doc.folderRelativePath || doc.fileName}
                      </p>
                      <p className="text-xs text-[#94A3B8]">
                        {doc.fileName} · {formatBytes(doc.sizeBytes)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={doc.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 items-center gap-1 rounded-md border border-[#E2E8F0] px-2.5 text-xs font-medium text-primary hover:bg-[#F8FAFC]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View
                    </a>
                    <a
                      href={doc.downloadUrl}
                      download={doc.fileName}
                      className="inline-flex h-8 items-center gap-1 rounded-md bg-primary px-2.5 text-xs font-medium text-white hover:opacity-90"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </CardContent>
      )}
    </Card>
  );
}
