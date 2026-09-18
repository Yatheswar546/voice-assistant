import { connectDB } from "@/lib/mongodb";
import { Document } from "@/models/Document";
import { DocumentChunk } from "@/models/DocumentChunk";
import { getParser } from "@/lib/rag/parsers/parser-factory";
import { downloadFileFromGridFS } from "@/lib/rag/gridfs";
import { cleanText } from "./cleaner";
import { chunkText } from "./chunker";
import { generateEmbedding } from "./embedding";

export async function ingestDocument(documentId: string) {
  await connectDB();

  const document = await Document.findById(documentId);

  if (!document) {
    throw new Error("Document not found.");
  }

  if (!document.gridFsFileId) {
    throw new Error("Document does not have a stored GridFS file.");
  }

  try {
    await Document.findByIdAndUpdate(documentId, {
      status: "processing",
      errorMessage: null,
    });

    // --------------------------------------------------
    // 1. Download original file from GridFS
    // --------------------------------------------------

    const buffer = await downloadFileFromGridFS(
      document.gridFsFileId.toString()
    );

    const arrayBuffer = new ArrayBuffer(buffer.byteLength);

    new Uint8Array(arrayBuffer).set(buffer);

    const file = new File(
      [arrayBuffer],
      document.originalName,
      {
        type: document.mimeType,
      }
    );

    // --------------------------------------------------
    // 2. Parse document
    // --------------------------------------------------

    const parser = getParser(file);

    const result = await parser.parse(file);

    // --------------------------------------------------
    // 3. Clean extracted text
    // --------------------------------------------------

    const cleanedContent = cleanText(result.content);

    // --------------------------------------------------
    // 4. Split document into chunks
    // --------------------------------------------------

    const chunks = chunkText(cleanedContent);

    console.log(
      `Document ${documentId} generated ${chunks.length} chunks.`
    );

    // --------------------------------------------------
    // 5. Remove old chunks
    // --------------------------------------------------

    await DocumentChunk.deleteMany({
      documentId: document._id,
    });

    // --------------------------------------------------
    // 6. Generate embeddings and save chunks
    // --------------------------------------------------

    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk.content);

      await DocumentChunk.create({
        documentId: document._id,
        userId: document.userId,
        content: chunk.content,
        chunkIndex: chunk.chunkIndex,
        embedding,

        metadata: {
          ...(result.metadata ?? {}),
          originalName: document.originalName,
        },
      });
    }

    // --------------------------------------------------
    // 7. Mark document as completed
    // --------------------------------------------------

    await Document.findByIdAndUpdate(documentId, {
      totalChunks: chunks.length,
      status: "completed",
    });

    return {
      documentId: document._id.toString(),
      content: cleanedContent,
      totalChunks: chunks.length,
      metadata: {
        ...(result.metadata ?? {}),
        originalName: document.originalName,
      },
    };
  } catch (error) {
    await Document.findByIdAndUpdate(documentId, {
      status: "failed",
      errorMessage:
        error instanceof Error
          ? error.message
          : "Document ingestion failed",
    });

    throw error;
  }
}