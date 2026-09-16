import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/lib/auth";
import { Document } from "@/models/Document";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    const formData = await req.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "File is required.",
        },
        {
          status: 400,
        }
      );
    }

    const document = await Document.create({
      userId: user.userId,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      status: "uploaded",
    });

    return NextResponse.json(
      {
        success: true,
        message: "File uploaded successfully.",
        document: {
          id: document._id,
          originalName: document.originalName,
          mimeType: document.mimeType,
          size: document.size,
          status: document.status,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error("Document Upload API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to upload file.",
      },
      {
        status: 500,
      }
    );
  }
}