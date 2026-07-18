import DocumentModel from "@/models/DocumentModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

     const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");
    if(!userId){
      throw new Error ("User id is required");
    }


    const document = await DocumentModel.getDocumentById(id, userId);

    return NextResponse.json(
      {
        document,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal Server Error!",
      },
      {
        status: 400,
      },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { markdown, userId } = body;

    const document = await DocumentModel.convertDocument(id, markdown, userId);

    return NextResponse.json(
      {
        document,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal Server Error!",
      },
      {
        status: 400,
      },
    );
  }
}
