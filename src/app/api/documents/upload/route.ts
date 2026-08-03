import { NextRequest, NextResponse } from "next/server";

import { getEmployeeSession } from "@/lib/auth/employee-session";

import {

  uploadEmployeeDocument,

  OnboardingError,

} from "@/lib/services/onboarding.service";

import { DocumentType } from "@/features/onboarding/constants";



export const runtime = "nodejs";

export const maxDuration = 60;



export async function POST(request: NextRequest) {

  try {

    const session = await getEmployeeSession();

    if (!session) {

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    }



    const formData = await request.formData();

    const file = formData.get("file");

    const documentType = formData.get("documentType");



    if (!(file instanceof File) || typeof documentType !== "string" || !documentType) {

      return NextResponse.json(

        { error: "Missing file or document type" },

        { status: 400 }

      );

    }



    if (!Object.values(DocumentType).includes(documentType as DocumentType)) {

      return NextResponse.json({ error: "Invalid document type" }, { status: 400 });

    }



    const record = await uploadEmployeeDocument(

      session.employeeId,

      documentType as DocumentType,

      file

    );



    return NextResponse.json({ success: true, data: record });

  } catch (error) {

    if (error instanceof OnboardingError) {

      return NextResponse.json(

        { error: error.message, code: error.code },

        { status: 400 }

      );

    }



    console.error("[documents/upload]", error);



    const message =

      error instanceof Error ? error.message : "Upload failed";



    return NextResponse.json({ error: message }, { status: 500 });

  }

}

