import { connectDB } from "@/lib/mongodb";
import { Document } from "@/models/Document";
import { getParser } from "@/lib/rag/parsers/parser-factory";
import { downloadFileFromGridFS } from "@/lib/rag/gridfs";
import { cleanText } from "./cleaner";
import { chunkText } from "./chunker";

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

        const parser = getParser(file);

        const result = await parser.parse(file);

        const cleanedContent = cleanText(result.content);

        const chunks = chunkText(cleanedContent);

        console.log(`Document ${documentId} generated ${chunks.length} chunks.`);

        await Document.findByIdAndUpdate(documentId, {
            status: "completed",
        });

        return {
            documentId: document._id.toString(),
            content: cleanedContent,
            chunks,
            metadata: result.metadata,
        };
    } catch(error) {
        await Document.findByIdAndUpdate(documentId, {
            status: "failed",
            errorMessage:
                error instanceof Error ? error.message : "Document ingestion failed",
        });

        throw error;
    }
}