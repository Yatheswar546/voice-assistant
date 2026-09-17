import { buildRagContext } from "./context-builder";

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

    const documentContext = buildRagContext(chunks);

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

${documentContext}

USER QUESTION
=============

${question}

Provide a clear and concise answer.
`.trim();
}