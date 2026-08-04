"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChevronRight,
  Download,
  Folder,
  FolderOpen,
  Loader2,
  ArrowLeft,
  FileStack,
} from "lucide-react";
import { EmployeeDocumentsFolderPanel } from "@/features/documents/components/EmployeeDocumentsFolderPanel";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonCard } from "@/components/ui/skeleton";

interface MasterFolderItem {
  employeeId: string;
  folderName: string;
  folderPath: string;
  documentCount: number;
  temporaryEmployeeId: string;
  employeeName: string;
  organizedAt: string;
  applicationRef?: string;
}

interface ListPayload {
  masterFolder: string;
  folders: MasterFolderItem[];
  canDownloadFolder?: boolean;
}

async function downloadEmployeeFolderZip(employeeId: string, folderName: string) {
  const res = await fetch(`/api/employee-documents-folder/${employeeId}/zip`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Folder download failed");
  }
  const blob = await res.blob();
  const disposition = res.headers.get("Content-Disposition");
  const match = disposition?.match(/filename="([^"]+)"/);
  const filename =
    match?.[1] ?? `${folderName.replace(/[\\/:*?"<>|]/g, "-")}.zip`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function EmployeeDocumentsBrowser() {
  const [data, setData] = useState<ListPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zipLoadingId, setZipLoadingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/employee-documents-folder");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Unable to load Employee Documents");
      }
      const json = (await res.json()) as ListPayload;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load folders");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDownloadFolder(folder: MasterFolderItem) {
    if (zipLoadingId) return;
    setError(null);
    setZipLoadingId(folder.employeeId);
    try {
      await downloadEmployeeFolderZip(folder.employeeId, folder.folderName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Folder download failed");
    } finally {
      setZipLoadingId(null);
    }
  }

  const selected = data?.folders.find((f) => f.employeeId === selectedId);
  const canDownloadFolder = Boolean(data?.canDownloadFolder);

  if (loading && !data) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error && !data) {
    return (
      <EmptyState
        title="Unable to load documents"
        description={error}
        icon={FileStack}
        action={
          <Button type="button" variant="outline" size="sm" onClick={() => void load()}>
            Try again
          </Button>
        }
      />
    );
  }

  if (selected) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#64748B]">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 font-medium text-[#1D4ED8] transition hover:bg-[#EFF6FF]"
          >
            <ArrowLeft className="h-4 w-4" />
            {data?.masterFolder ?? "Employee Documents"}
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-primary">{selected.folderName}</span>
        </div>
        <EmployeeDocumentsFolderPanel
          employeeId={selected.employeeId}
          showWhenEmpty
          defaultOpen
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#1D4ED8]">
              <FolderOpen className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-heading text-lg font-semibold text-primary">
                {data?.masterFolder ?? "Employee Documents"}
              </h3>
              <p className="mt-1 text-sm text-[#64748B]">
                Folders are created after L2 approval. Open a folder to view files, or download as
                ZIP.
              </p>
              <p className="mt-2 text-xs font-medium text-[#94A3B8]">
                {data?.folders.length ?? 0} employee folder
                {(data?.folders.length ?? 0) === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => void load()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      {!data?.folders.length ? (
        <EmptyState
          title="No employee folders yet"
          description="Folders appear here after L2 approval and temporary employee ID generation."
          icon={Folder}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {data.folders.map((folder) => (
            <article
              key={folder.employeeId}
              className="group flex flex-col rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#1D4ED8]">
                  <Folder className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h4 className="truncate font-semibold text-primary">{folder.folderName}</h4>
                  <p className="mt-0.5 truncate text-xs text-[#64748B]">{folder.folderPath}</p>
                  <p className="mt-2 text-xs text-[#94A3B8]">
                    {folder.documentCount} document
                    {folder.documentCount === 1 ? "" : "s"}
                    {folder.applicationRef ? ` · ${folder.applicationRef}` : ""}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="sky"
                  size="sm"
                  onClick={() => setSelectedId(folder.employeeId)}
                >
                  <FolderOpen className="h-4 w-4" />
                  View Folder
                </Button>
                {canDownloadFolder && folder.documentCount > 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    isLoading={zipLoadingId === folder.employeeId}
                    disabled={!!zipLoadingId}
                    onClick={() => void handleDownloadFolder(folder)}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
