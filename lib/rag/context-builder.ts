interface RetrievedChunk {
    content: string;
    chunkIndex: number;
    metadata?: Record<string, unknown>;
    score?: number;
}

export function buildRagContext(chunks: RetrievedChunk[]): string {
    if (!chunks.length) {
        return "No relevant document context was found.";
    }

    return chunks
        .map((chunk, index) => {
            const documentName =
                typeof chunk.metadata?.originalName === "string"
                    ? chunk.metadata.originalName
                    : "Unknown Document";

            return `[Source ${index + 1}]
Document: ${documentName}
Chunk: ${chunk.chunkIndex}
Similarity: ${chunk.score?.toFixed(4) ?? "N/A"}

${chunk.content}`;
        })
        .join("\n\n");
}