import { GridFSBucket, ObjectId } from "mongodb";
import mongoose from "mongoose";

const GRIDFS_BUCKET_NAME = "documents";

function getDatabase() {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB database connection is not available.");
  }

  return db;
}

export function getGridFSBucket() {
  return new GridFSBucket(getDatabase(), {
    bucketName: GRIDFS_BUCKET_NAME,
  });
}

export async function uploadFileToGridFS(
  file: File,
  metadata: {
    documentId: string;
    userId: string;
    mimeType: string;
  }
) {
  const bucket = getGridFSBucket();

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<ObjectId>((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(file.name, {
      metadata: {
        documentId: metadata.documentId,
        userId: metadata.userId,
        mimeType: metadata.mimeType,
      },
    });

    uploadStream.on("error", reject);

    uploadStream.on("finish", () => {
      resolve(uploadStream.id as ObjectId);
    });

    uploadStream.end(buffer);
  });
}