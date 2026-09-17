import { generateGeminiEmbedding } from "@/lib/gemini";

const EMBEDDING_MODEL = "gemini-embedding-001";

export async function generateEmbedding(text: string) {
    if (!text.trim()) {
        throw new Error("Cannot generate embedding for empty text.");
    }

    const embedding = await generateGeminiEmbedding({
        model: EMBEDDING_MODEL,
        text,
    });

    if (!embedding.length) {
        throw new Error("Embedding generation returned an empty vector.");
    }

    return embedding;
}