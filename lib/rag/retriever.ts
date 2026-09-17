import { connectDB } from "@/lib/mongodb";
import { generateEmbedding } from "./embedding";
import { searchSimilarChunks } from "@/lib/rag/vector-store";

export interface RetrievedChunk {
    content: string;
    chunkIndex: number;
    documentId: unknown;
    metadata?: Record<string, unknown>;
    score?: number;
}

interface RetrieveOptions {
    query: string;
    userId: string;
    limit?: number;
    documentId?: string;
}

export async function retrieveRelevantChunks({
    query,
    userId,
    limit = 5,
    documentId,
}: RetrieveOptions): Promise<RetrievedChunk[]> {
    if (!query.trim()) {
        throw new Error("Query cannot be empty.");
    }

    await connectDB();

    const queryVector = await generateEmbedding(query);

    const results = await searchSimilarChunks({
        userId,
        queryVector,
        limit,
        documentId,
    });

    return results as RetrievedChunk[];
}