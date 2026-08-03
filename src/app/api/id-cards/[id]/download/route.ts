import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { UserRole } from "@/types/enums";
import {
  recordIdCardDownload,
  getIdCardDownloadUrl,
  IdCardError,
} from "@/lib/services/id-card.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user || session.user.role !== UserRole.SUPPORT) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const logDownload = request.nextUrl.searchParams.get("log") !== "false";

  try {
    let url: string;
    let fileName: string;

    if (logDownload) {
      const result = await recordIdCardDownload(id, session.user.id);
      url = result.url;
      fileName = result.fileName;
    } else {
      const result = await getIdCardDownloadUrl(id);
      if (!result) {
        return NextResponse.json({ error: "ID card not found" }, { status: 404 });
      }
      url = result.url;
      fileName = result.fileName;
    }

    const pdfRes = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!pdfRes.ok) {
      return NextResponse.json({ error: "Failed to fetch PDF" }, { status: 502 });
    }

    const buffer = await pdfRes.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (error) {
    if (error instanceof IdCardError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
