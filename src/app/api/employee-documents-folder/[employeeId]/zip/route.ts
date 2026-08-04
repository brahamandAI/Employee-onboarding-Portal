import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { auth } from "@/lib/auth/config";
import { StaffRole } from "@/types/enums";
import {
  canAccessDocumentsFolder,
  getEmployeeDocumentsFolder,
} from "@/lib/services/employee-documents-folder.service";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ employeeId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { employeeId } = await params;
  const data = await getEmployeeDocumentsFolder(employeeId);
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const access = canAccessDocumentsFolder({
    role: session.user.role as StaffRole,
    userId: session.user.id,
    employee: {
      status: data.employeeStatus,
      submittedBy: data.submittedBy,
      temporaryEmployeeId: data.temporaryEmployeeId,
      forwardedToAdminAt: data.forwardedToAdminAt,
      forwardedToSupportAt: data.forwardedToSupportAt,
      l2Decision: data.l2Decision,
      documentsFolder: data.folder,
    },
  });

  if (!access.allowed || !access.canDownloadZip) {
    return NextResponse.json(
      { error: access.reason ?? "ZIP download not permitted" },
      { status: 403 }
    );
  }

  const zip = new JSZip();
  const root =
    data.folder?.folderName ||
    data.temporaryEmployeeId ||
    "Employee Documents";

  const folder = zip.folder(root);
  if (!folder) {
    return NextResponse.json({ error: "Unable to create ZIP" }, { status: 500 });
  }

  for (const doc of data.documents) {
    try {
      const res = await fetch(doc.url);
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      // Preserve employee folder structure: TEMP ID - Name / Label / file
      const entryPath = doc.folderRelativePath || `${doc.label}/${doc.fileName}`;
      folder.file(entryPath, buf);
    } catch {
      // skip failed fetches
    }
  }

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  const safeName = (data.folder?.folderName || root).replace(/[\\/:*?"<>|]/g, "-").trim();
  const filename = `${safeName}.zip`;

  return new NextResponse(new Uint8Array(zipBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
