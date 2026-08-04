import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { isStaffRole } from "@/lib/auth/permissions";
import { getDashboardLiveSnapshot } from "@/lib/services/dashboard-live.service";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || !session.user.role || !isStaffRole(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snapshot = await getDashboardLiveSnapshot(
    session.user.role,
    session.user.id
  );

  return NextResponse.json({
    ...snapshot,
    at: new Date().toISOString(),
  });
}
