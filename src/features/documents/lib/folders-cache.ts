export interface CachedFolderItem {
  employeeId: string;
  folderName: string;
  folderPath: string;
  documentCount: number;
  temporaryEmployeeId: string;
  employeeName: string;
  organizedAt: string;
  applicationRef?: string;
}

export interface CachedFoldersPayload {
  masterFolder: string;
  folders: CachedFolderItem[];
  canDownloadFolder?: boolean;
}

let cache: { data: CachedFoldersPayload; ts: number } | null = null;
let inflight: Promise<CachedFoldersPayload> | null = null;

const TTL_MS = 30_000;

export function peekEmployeeFoldersCache(): CachedFoldersPayload | null {
  return cache?.data ?? null;
}

export async function prefetchEmployeeFolders(
  force = false
): Promise<CachedFoldersPayload> {
  if (!force && cache && Date.now() - cache.ts < TTL_MS) {
    return cache.data;
  }
  if (inflight) return inflight;

  inflight = fetch("/api/employee-documents-folder", { cache: "no-store" })
    .then(async (res) => {
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || "Unable to load Employee Documents");
      }
      return res.json() as Promise<CachedFoldersPayload>;
    })
    .then((data) => {
      cache = { data, ts: Date.now() };
      return data;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}
