"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PreviewDocument {
  _id: string;
  documentType: string;
  label: string;
  fileName: string;
  mimeType: string;
  sizeBytes?: number;
  /** Direct Cloudinary URL used for instant image previews */
  url?: string;
}

interface DocumentPreviewGridProps {
  documents: PreviewDocument[];
  emptyMessage?: string;
}

function formatBytes(n?: number) {
  if (!n) return null;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function fileUrl(docId: string, mode: "inline" | "download") {
  return `/api/staff-documents/${docId}${mode === "download" ? "?mode=download" : ""}`;
}

function isImage(mimeType: string) {
  return mimeType.startsWith("image/");
}

function isPdf(mimeType: string) {
  return mimeType === "application/pdf";
}

export function DocumentPreviewGrid({
  documents,
  emptyMessage = "No documents uploaded.",
}: DocumentPreviewGridProps) {
  const [active, setActive] = useState<PreviewDocument | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [active, close]);

  async function download(doc: PreviewDocument) {
    setError(null);
    setDownloadingId(doc._id);
    try {
      const res = await fetch(fileUrl(doc._id, "download"), { cache: "no-store" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Download failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloadingId(null);
    }
  }

  if (documents.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-sm text-[#64748B]">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {documents.map((doc) => {
          const size = formatBytes(doc.sizeBytes);
          const Icon = isImage(doc.mimeType) ? ImageIcon : FileText;

          return (
            <li
              key={doc._id}
              className="flex flex-col justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3.5 transition hover:border-[#BFDBFE] hover:shadow-[0_10px_28px_-22px_rgba(29,78,216,0.5)]"
            >
              <div className="flex min-w-0 items-start gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8]">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-primary">
                    {doc.label}
                  </p>
                  <p className="truncate text-xs text-[#64748B]" title={doc.fileName}>
                    {doc.fileName}
                  </p>
                  {size && <p className="mt-0.5 text-[11px] text-[#94A3B8]">{size}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setError(null);
                    setActive(doc);
                  }}
                  aria-label={`Preview ${doc.label}`}
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="flex-1"
                  isLoading={downloadingId === doc._id}
                  onClick={() => void download(doc)}
                  aria-label={`Download ${doc.label}`}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.label} preview`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1F3A]/70 p-3 backdrop-blur-sm sm:p-6"
          onClick={close}
        >
          <div
            className="flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#E2E8F0] px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-primary">
                  {active.label}
                </p>
                <p className="truncate text-xs text-[#64748B]">{active.fileName}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={fileUrl(active._id, "inline")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E2E8F0] px-2.5 text-xs font-medium text-primary transition hover:bg-[#F8FAFC]"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open
                </a>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  isLoading={downloadingId === active._id}
                  onClick={() => void download(active)}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close preview"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#475569] transition hover:bg-[#F8FAFC]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto bg-[#F1F5F9] p-3">
              <DocumentPreviewBody key={active._id} doc={active} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentPreviewBody({ doc }: { doc: PreviewDocument }) {
  const proxySrc = fileUrl(doc._id, "inline");
  const [src, setSrc] = useState(doc.url || proxySrc);
  const [failed, setFailed] = useState(false);

  if (isImage(doc.mimeType)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        {failed ? (
          <PreviewFallback doc={doc} />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={src}
            alt={doc.label}
            decoding="async"
            fetchPriority="high"
            onError={() => {
              if (src !== proxySrc) {
                setSrc(proxySrc);
                return;
              }
              setFailed(true);
            }}
            className="mx-auto max-h-[72vh] w-auto rounded-lg bg-white object-contain shadow-sm"
          />
        )}
      </div>
    );
  }

  if (isPdf(doc.mimeType)) {
    return (
      <iframe
        src={proxySrc}
        title={`${doc.label} preview`}
        className="h-[72vh] w-full rounded-lg border-0 bg-white"
      />
    );
  }

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <PreviewFallback doc={doc} />
    </div>
  );
}

function PreviewFallback({ doc }: { doc: PreviewDocument }) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white px-6 py-8 text-center">
      <FileText className="mx-auto h-8 w-8 text-[#94A3B8]" />
      <p className="mt-3 text-sm font-medium text-primary">
        Inline preview is not available for this file type
      </p>
      <p className="mt-1 text-xs text-[#64748B]">{doc.fileName}</p>
      <a
        href={fileUrl(doc._id, "download")}
        className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-white transition hover:opacity-90"
      >
        <Download className="h-4 w-4" />
        Download file
      </a>
    </div>
  );
}
