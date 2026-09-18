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
   * 1. Validate the selected document
   * ---------------------------------------------------------
   *
   * If a documentId is provided, make sure:
   * - the document exists
   * - it belongs to the logged-in user
   * - ingestion has completed
   */

  let activeDocumentName: string | null = null;

  if (user && documentId) {
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

    activeDocumentName = document.originalName;
  }

  /*
   * ---------------------------------------------------------
   * 2. Load or create chat session
   * ---------------------------------------------------------
   */

  if (user && !activeSessionId) {
    const newSession = await ChatSession.create({
      userId: user.userId,
      title: message.slice(0, 50),

      // Associate the newly created chat with the document.
      documentId: documentId ?? null,
      documentName: activeDocumentName,
    });

    activeSessionId = newSession._id.toString();
  }

  /*
   * ---------------------------------------------------------
   * 3. Update existing session's document
   * ---------------------------------------------------------
   *
   * If this is an existing chat and a document was uploaded,
   * associate that document with the existing chat session.
   */

  if (user && activeSessionId && documentId) {
    await ChatSession.findOneAndUpdate(
      {
        _id: activeSessionId,
        userId: user.userId,
      },
      {
        documentId,
        documentName: activeDocumentName,
      }
    );
  }

  /*
   * ---------------------------------------------------------
   * 4. Load previous conversation history
   * ---------------------------------------------------------
   *
   * Load the previous 20 messages before adding the
   * current user message to the AI context.
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
   * 5. RAG retrieval
   * ---------------------------------------------------------
   *
   * RAG runs only when a specific document is selected.
   *
   * Without documentId:
   * - no document search
   * - normal AI conversation
   */

  let ragPrompt = message;

  let sources: ProcessChatResponse["sources"] = [];

  if (user && documentId) {
    /*
     * We already validated the document above.
     *
     * Retrieve chunks ONLY from this document.
     */

    console.log("========== RAG RETRIEVAL ==========");
    console.log("[RAG] Question:", message);
    console.log("[RAG] Document ID:", documentId);
    console.log("[RAG] Document:", activeDocumentName);
    console.log("[RAG] Requested Top-K: 5");

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
        `      Document: ${
          typeof chunk.metadata?.originalName === "string"
            ? chunk.metadata.originalName
            : activeDocumentName
        }`
      );

      console.log(`      Chunk: ${chunk.chunkIndex}`);

      console.log(
        `      Score: ${
          chunk.score?.toFixed(4) ?? "N/A"
        }`
      );
    });

    console.log("===================================");

    /*
     * Build the RAG prompt.
     *
     * buildRagPrompt() internally builds the document
     * context from the retrieved chunks.
     */

    ragPrompt = buildRagPrompt({
      question: message,
      chunks: retrievedChunks,
    });

    /*
     * Return retrieved source information.
     */

    sources = retrievedChunks.map((chunk) => ({
      documentId: String(chunk.documentId),
      documentName:
        typeof chunk.metadata?.originalName === "string"
          ? chunk.metadata.originalName
          : activeDocumentName || "Unknown Document",
      chunkIndex: chunk.chunkIndex,
      score: chunk.score,
    }));
  }

  /*
   * ---------------------------------------------------------
   * 6. Build AI conversation
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
   * 7. Generate AI response
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
   * 8. Persist conversation
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