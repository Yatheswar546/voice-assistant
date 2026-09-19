import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/lib/auth";
import { Document } from "@/models/Document";
import {
  sanitizeFileName,
  validateUploadedFile,
} from "@/lib/rag/file-validator";
import { uploadFileToGridFS } from "@/lib/rag/gridfs";
import { ingestDocument } from "@/lib/rag/ingestion-service";

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

    const validation = validateUploadedFile(file);

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: validation.message,
        },
        {
          status: 400,
        }
      );
    }

    // Convert the user-provided filename into a safe filename.
    const safeFileName = sanitizeFileName(file.name);

    const document = await Document.create({
      userId: user.userId,
      originalName: safeFileName,
      mimeType: file.type,
      size: file.size,
      status: "completed",
    });

    try {
      const gridFsFileId = await uploadFileToGridFS(file, {
        documentId: document._id.toString(),
        userId: user.userId.toString(),
        mimeType: file.type,
        fileName: safeFileName,
      });

      document.gridFsFileId = gridFsFileId;

      await document.save();
    } catch (error) {
      await Document.findByIdAndUpdate(document._id, {
        status: "failed",
        errorMessage: "Failed to store uploaded file.",
      });

      throw error;
    }

    await ingestDocument(document._id.toString());

    return NextResponse.json(
      {
        success: true,
        message: "File uploaded and processed successfully.",
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