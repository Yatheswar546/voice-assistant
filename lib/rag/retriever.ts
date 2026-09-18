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

  console.log("\n========== RAG RETRIEVAL ==========");
  console.log("[RAG] Question:", query);
  console.log("[RAG] Requested Top-K:", limit);

  await connectDB();

  // 1. Generate embedding for the user's question
  const queryVector = await generateEmbedding(query);

  console.log(
    "[RAG] Query embedding generated. Dimensions:",
    queryVector.length
  );

  // 2. Search MongoDB Atlas Vector Search
  const results = (await searchSimilarChunks({
    userId,
    queryVector,
    limit,
    documentId,
  })) as RetrievedChunk[];

  console.log("[RAG] Retrieved chunks:", results.length);

  // 3. Log retrieved sources
  results.forEach((chunk, index) => {
    const documentName =
      typeof chunk.metadata?.originalName === "string"
        ? chunk.metadata.originalName
        : "Unknown Document";

    console.log(`[RAG] Source ${index + 1}:`);
    console.log("      Document:", documentName);
    console.log("      Chunk:", chunk.chunkIndex);
    console.log(
      "      Score:",
      chunk.score !== undefined
        ? chunk.score.toFixed(4)
        : "N/A"
    );
  });

  console.log("===================================\n");

  return results;
}