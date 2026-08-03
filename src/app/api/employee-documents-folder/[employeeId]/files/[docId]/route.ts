import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { StaffRole } from "@/types/enums";
import { connectDB } from "@/lib/db/connect";
import { EmployeeDocument } from "@/lib/db/models/EmployeeDocument";
import {
  canAccessDocumentsFolder,
  getEmployeeDocumentsFolder,
} from "@/lib/services/employee-documents-folder.service";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ employeeId: string; docId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { employeeId, docId } = await params;
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

  await connectDB();
  const doc = await EmployeeDocument.findOne({
    _id: docId,
    employeeId,
    isActive: true,
  });
  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const upstream = await fetch(doc.url);
  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Unable to fetch document" },
      { status: 502 }
    );
  }

  const buffer = Buffer.from(await upstream.arrayBuffer());
  const disposition = `attachment; filename="${doc.fileName.replace(/"/g, "")}"`;

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": doc.mimeType || "application/octet-stream",
      "Content-Disposition": disposition,
      "Content-Length": String(buffer.length),
      "Cache-Control": "private, no-store",
    },
  });
}
