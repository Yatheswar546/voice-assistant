import { getAuthenticatedUser } from "@/lib/auth";
import { generateChatCompletion } from "@/lib/ai";
import { AI_CONFIG } from "@/settings/ai.config";

import { ChatSession } from "@/models/ChatSession";
import { Document } from "@/models/Document";
import { Message } from "@/models/Message";

import { retrieveRelevantChunks } from "@/lib/rag/retriever";
import { buildRagPrompt } from "@/lib/rag/prompt-builder";

interface ProcessChatParams {
  message: string;
  sessionId?: string;
  documentId?: string;
}

export interface ProcessChatResponse {
  reply: string;
  sessionId: string | null;
  sources: Array<{
    documentId: string;
    documentName: string;
    chunkIndex: number;
    score?: number;
  }>;
}

export async function processChat({
  message,
  sessionId,
  documentId,
}: ProcessChatParams): Promise<ProcessChatResponse> {
  const user = await getAuthenticatedUser();

  let activeSessionId = sessionId ?? null;

  /*
   * ---------------------------------------------------------
   * 1. Load or create chat session
   * ---------------------------------------------------------
   */

  if (user && !activeSessionId) {
    const newSession = await ChatSession.create({
      userId: user.userId,
      title: message.slice(0, 50),
    });

    activeSessionId = newSession._id.toString();
  }

  /*
   * ---------------------------------------------------------
   * 2. Load previous conversation history
   * ---------------------------------------------------------
   */

  let previousMessages: Array<{
    role: "user" | "assistant";
    content: string;
  }> = [];

  if (user && activeSessionId) {
    const history = await Message.find({
      sessionId: activeSessionId,
      userId: user.userId,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    previousMessages = history
      .reverse()
      .map((item) => ({
        role: item.role as "user" | "assistant",
        content: item.content,
      }));
  }

  /*
   * ---------------------------------------------------------
   * 3. RAG retrieval
   * ---------------------------------------------------------
   *
   * RAG runs only when a specific document is selected.
   *
   * Without documentId, the user gets normal AI chat and
   * previously uploaded documents are not searched.
   */

  let ragPrompt = message;

  let sources: ProcessChatResponse["sources"] = [];

  if (user && documentId) {
    /*
     * Verify that the document:
     * - exists
     * - belongs to the authenticated user
     * - has completed ingestion
     */

    const document = await Document.findOne({
      _id: documentId,
      userId: user.userId,
      status: "completed",
    }).lean();

    if (!document) {
      throw new Error(
        "Document not found or is not ready for questions."
      );
    }

    console.log("========== RAG RETRIEVAL ==========");
    console.log("[RAG] Question:", message);
    console.log("[RAG] Document ID:", documentId);
    console.log("[RAG] Document:", document.originalName);
    console.log("[RAG] Requested Top-K: 5");

    /*
     * Retrieve chunks ONLY from the selected document.
     */

    const retrievedChunks = await retrieveRelevantChunks({
      query: message,
      userId: user.userId,
      documentId,
      limit: 5,
    });

    console.log(
      "[RAG] Retrieved chunks:",
      retrievedChunks.length
    );

    retrievedChunks.forEach((chunk, index) => {
      console.log(`[RAG] Source ${index + 1}:`);

      console.log(
        `      Document: ${chunk.metadata?.originalName ||
        document.originalName
        }`
      );

      console.log(`      Chunk: ${chunk.chunkIndex}`);

      console.log(
        `      Score: ${chunk.score?.toFixed(4) ?? "N/A"
        }`
      );
    });

    console.log("===================================");

    /*
     * Build the final RAG prompt.
     *
     * buildRagPrompt() internally calls buildRagContext()
     * using the retrieved chunks.
     */

    ragPrompt = buildRagPrompt({
      question: message,
      chunks: retrievedChunks,
    });

    /*
     * Keep source information for the API response.
     */

    sources = retrievedChunks.map((chunk) => ({
      documentId: String(chunk.documentId),
      documentName:
        typeof chunk.metadata?.originalName === "string"
          ? chunk.metadata.originalName
          : document.originalName,
      chunkIndex: chunk.chunkIndex,
      score: chunk.score,
    }));
  }

  /*
   * ---------------------------------------------------------
   * 4. Build AI conversation
   * ---------------------------------------------------------
   */

  const aiMessages = [
    ...previousMessages,
    {
      role: "user" as const,
      content: ragPrompt,
    },
  ];

  /*
   * ---------------------------------------------------------
   * 5. Generate AI response
   * ---------------------------------------------------------
   */

  const reply = await generateChatCompletion({
    model: AI_CONFIG.MODEL,
    messages: aiMessages,
    temperature: AI_CONFIG.TEMPERATURE,
    maxOutputTokens: AI_CONFIG.MAX_OUTPUT_TOKENS,
  });

  /*
   * ---------------------------------------------------------
   * 6. Persist conversation
   * ---------------------------------------------------------
   */

  if (user && activeSessionId) {
    await Message.create([
      {
        sessionId: activeSessionId,
        userId: user.userId,
        role: "user",
        content: message,
      },
      {
        sessionId: activeSessionId,
        userId: user.userId,
        role: "assistant",
        content: reply,
      },
    ]);
  }

  return {
    reply,
    sessionId: activeSessionId,
    sources,
  };
}