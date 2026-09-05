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
import {
  peekEmployeeFoldersCache,
  prefetchEmployeeFolders,
} from "@/features/documents/lib/folders-cache";

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
  const [data, setData] = useState<ListPayload | null>(() => peekEmployeeFoldersCache());
  const [loading, setLoading] = useState(() => !peekEmployeeFoldersCache());
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [zipLoadingId, setZipLoadingId] = useState<string | null>(null);

  const load = useCallback(async (force = false) => {
    const cached = peekEmployeeFoldersCache();
    if (!cached) setLoading(true);
    setError(null);
    try {
      const json = await prefetchEmployeeFolders(force);
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load folders");
      if (!cached) setData(null);
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
  const q = search.trim().toLowerCase();
  const folders = (data?.folders ?? []).filter((folder) => {
    if (!q) return true;
    return [
      folder.employeeName,
      folder.folderName,
      folder.temporaryEmployeeId,
      folder.applicationRef,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  if (loading && !data) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#1D4ED8]">
              <FolderOpen className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-heading text-lg font-semibold text-primary">
                Employee Documents
              </h3>
              <p className="mt-1 text-sm text-[#64748B]">
                Folders are created after L2 approval. Open a folder to view files, or download as
                ZIP.
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
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
          <Button type="button" variant="outline" size="sm" onClick={() => void load(true)}>
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
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 font-semibold text-[#1D4ED8] shadow-sm transition hover:bg-[#EFF6FF]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
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
          <Button type="button" variant="outline" size="sm" onClick={() => void load(true)}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Refresh
          </Button>
        </div>
        {(data?.folders.length ?? 0) > 0 && (
          <div className="relative mt-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee name or ID"
              className="h-10 w-full rounded-xl border border-[#E2E8F0] bg-white px-3.5 text-sm"
              aria-label="Search employee folders"
            />
          </div>
        )}
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
      ) : !folders.length ? (
        <EmptyState
          title="No matching folders"
          description="Try a different name or employee ID."
          icon={Folder}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {folders.map((folder) => (
            <article
              key={folder.employeeId}
              className="flex flex-col rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#1D4ED8]">
                  <Folder className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h4 className="truncate font-heading font-semibold text-primary">
                    {folder.employeeName || folder.folderName}
                  </h4>
                  <p className="mt-1 font-mono text-xs text-[#334155]">
                    ID: {folder.temporaryEmployeeId || "—"}
                  </p>
                  <p className="mt-1 text-xs text-[#64748B]">
                    {folder.documentCount} document{folder.documentCount === 1 ? "" : "s"}
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
                    Download Folder
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
