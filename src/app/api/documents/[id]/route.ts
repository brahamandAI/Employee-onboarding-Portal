import { NextRequest, NextResponse } from "next/server";
import { getEmployeeSession } from "@/lib/auth/employee-session";
import { connectDB } from "@/lib/db/connect";
import { EmployeeDocument } from "@/lib/db/models/EmployeeDocument";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getEmployeeSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const doc = await EmployeeDocument.findOne({
      _id: id,
      employeeId: session.employeeId,
      isActive: true,
    });

    if (!doc?.url) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.redirect(doc.url);
  } catch {
    return NextResponse.json({ error: "Failed to retrieve document" }, { status: 500 });
  }
}
