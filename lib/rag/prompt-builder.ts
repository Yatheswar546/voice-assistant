interface RetrievedChunk {
    content: string;
    chunkIndex: number;
    documentId: unknown;
    metadata?: Record<string, unknown>;
    score?: number;
}

interface BuildRagPromptOptions {
    question: string;
    chunks: RetrievedChunk[];
}

export function buildRagPrompt({
    question,
    chunks,
}: BuildRagPromptOptions): string {
    if (!question.trim()) {
        throw new Error("Question cannot be empty.");
    }

    const documentContext = chunks
        .map((chunk, index) => {
            const documentName =
                typeof chunk.metadata?.originalName === "string"
                    ? chunk.metadata.originalName
                    : "Unknown Document";

            return `
[Retrieved Document ${index + 1}]
Document: ${documentName}
Chunk Index: ${chunk.chunkIndex}
Similarity Score: ${chunk.score?.toFixed(4) ?? "N/A"}

${chunk.content}
`;
        })
        .join("\n");

    return `
You are a helpful AI assistant.

Answer the user's question using the retrieved document context provided below.

Use the retrieved context as the primary source of information.

If the answer cannot be found in the retrieved context, clearly state that
the information is not available in the provided documents.

Do not invent, assume, or hallucinate information that is not supported
by the retrieved context.

RETRIEVED DOCUMENT CONTEXT
==========================

${documentContext || "No relevant document context was found."}

USER QUESTION
=============

${question}

Provide a clear and concise answer.
`.trim();
}