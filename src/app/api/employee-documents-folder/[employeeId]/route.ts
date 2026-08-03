import { NextRequest, NextResponse } from "next/server";
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

  if (!access.allowed) {
    return NextResponse.json(
      { error: access.reason ?? "Forbidden" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    folder: data.folder,
    documents: data.documents.map((d) => ({
      _id: d._id,
      documentType: d.documentType,
      label: d.label,
      fileName: d.fileName,
      mimeType: d.mimeType,
      sizeBytes: d.sizeBytes,
      folderRelativePath: d.folderRelativePath,
      // Use secure download endpoint instead of exposing raw URL for ZIP/list UI
      downloadUrl: `/api/employee-documents-folder/${employeeId}/files/${d._id}`,
    })),
    permissions: {
      canDownloadZip: access.canDownloadZip,
      readOnly: access.readOnly,
      canEdit: false,
      canDelete: false,
      canReplace: false,
    },
  });
}
