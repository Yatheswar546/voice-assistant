import { getAuthenticatedUser } from "@/lib/auth";
import { generateChatCompletion } from "@/lib/ai";
import { AI_CONFIG } from "@/settings/ai.config";

import { ChatSession } from "@/models/ChatSession";
import { Document } from "@/models/Document";
import { Message } from "@/models/Message";

import { retrieveRelevantChunks } from "@/lib/rag/retriever";
import { buildRagPrompt } from "@/lib/rag/prompt-builder";
import {
  routeQuery,
  type QueryType,
} from "@/lib/rag/query-router";

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

const MAX_COMPARISON_DOCUMENTS = 2;
const RAG_TOP_K_PER_DOCUMENT = 5;

export async function processChat({
  message,
  sessionId,
  documentId,
}: ProcessChatParams): Promise<ProcessChatResponse> {
  const user = await getAuthenticatedUser();

  let activeSessionId = sessionId ?? null;

  /*
   * ---------------------------------------------------------
   * 1. Validate selected document
   * ---------------------------------------------------------
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
      documentId: documentId ?? null,
      documentName: activeDocumentName,
    });

    activeSessionId = newSession._id.toString();
  }

  /*
   * ---------------------------------------------------------
   * 3. Update active document for existing session
   * ---------------------------------------------------------
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
   * 4. Load last 20 conversation messages
   * ---------------------------------------------------------
   */

  let previousMessages: Array<{
    role: "user" | "assistant";
    content: string;
  }> = [];

  let conversationDocumentIds: string[] = [];

  if (user && activeSessionId) {
    const history = await Message.find({
      sessionId: activeSessionId,
      userId: user.userId,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    /*
     * Collect document IDs associated with the
     * previous 20 messages.
     */
    conversationDocumentIds = [
      ...new Set(
        history
          .map((item) =>
            item.documentId
              ? String(item.documentId)
              : null
          )
          .filter(
            (id): id is string => Boolean(id)
          )
      ),
    ];

    /*
     * Convert history into chronological order
     * for the AI conversation.
     */
    previousMessages = history
      .reverse()
      .map((item) => ({
        role: item.role as "user" | "assistant",
        content: item.content,
      }));
  }

  /*
   * Add currently active document to the conversation
   * document list.
   */
  if (documentId) {
    conversationDocumentIds = [
      ...new Set([
        ...conversationDocumentIds,
        documentId,
      ]),
    ];
  }

  /*
   * ---------------------------------------------------------
   * 5. Determine query type
   * ---------------------------------------------------------
   */

  const queryType: QueryType = routeQuery({
    message,
    hasDocument: conversationDocumentIds.length > 0,
    hasMultipleDocuments:
      conversationDocumentIds.length > 1,
  });

  console.log("========== QUERY ROUTER ==========");
  console.log("[Router] Question:", message);
  console.log("[Router] Query type:", queryType);
  console.log(
    "[Router] Conversation documents:",
    conversationDocumentIds
  );
  console.log("==================================");

  /*
   * ---------------------------------------------------------
   * 6. RAG retrieval
   * ---------------------------------------------------------
   */

  let ragPrompt = message;

  let sources: ProcessChatResponse["sources"] = [];

  /*
   * =========================================================
   * GENERAL QUERY
   * =========================================================
   *
   * No document retrieval.
   *
   * Example:
   * "Hello, how are you?"
   * "Are you ready to work?"
   */

  if (user && queryType === "general") {
    console.log(
      "[RAG] Skipped - general conversation query."
    );
  }

  /*
   * =========================================================
   * SINGLE DOCUMENT QUERY
   * =========================================================
   */

  if (
    user &&
    queryType === "document" &&
    documentId
  ) {
    console.log("========== RAG RETRIEVAL ==========");
    console.log("[RAG] Mode: Single Document");
    console.log("[RAG] Question:", message);
    console.log("[RAG] Document:", documentId);
    console.log(
      "[RAG] Requested Top-K:",
      RAG_TOP_K_PER_DOCUMENT
    );

    const retrievedChunks =
      await retrieveRelevantChunks({
        query: message,
        userId: user.userId,
        documentId,
        limit: RAG_TOP_K_PER_DOCUMENT,
      });

    console.log(
      "[RAG] Retrieved chunks:",
      retrievedChunks.length
    );

    ragPrompt = buildRagPrompt({
      question: message,
      chunks: retrievedChunks,
    });

    sources = retrievedChunks.map((chunk) => ({
      documentId: String(chunk.documentId),
      documentName:
        typeof chunk.metadata?.originalName === "string"
          ? chunk.metadata.originalName
          : activeDocumentName || "Unknown Document",
      chunkIndex: chunk.chunkIndex,
      score: chunk.score,
    }));

    console.log("===================================");
  }

  /*
   * =========================================================
   * TWO DOCUMENT COMPARISON
   * =========================================================
   */

  if (
    user &&
    queryType === "comparison" &&
    conversationDocumentIds.length >=
      MAX_COMPARISON_DOCUMENTS
  ) {
    const comparisonDocumentIds =
      conversationDocumentIds.slice(
        -MAX_COMPARISON_DOCUMENTS
      );

    console.log("========== RAG RETRIEVAL ==========");
    console.log(
      "[RAG] Mode: Two Document Comparison"
    );
    console.log("[RAG] Question:", message);
    console.log(
      "[RAG] Documents:",
      comparisonDocumentIds
    );
    console.log(
      "[RAG] Top-K per document:",
      RAG_TOP_K_PER_DOCUMENT
    );

    /*
     * Retrieve independently from each document.
     *
     * Document A → Top 5
     * Document B → Top 5
     */
    const retrievedChunksByDocument =
      await Promise.all(
        comparisonDocumentIds.map(
          (currentDocumentId) =>
            retrieveRelevantChunks({
              query: message,
              userId: user.userId,
              documentId: currentDocumentId,
              limit: RAG_TOP_K_PER_DOCUMENT,
            })
        )
      );

    const retrievedChunks =
      retrievedChunksByDocument.flat();

    console.log(
      "[RAG] Total comparison chunks:",
      retrievedChunks.length
    );

    /*
     * Build RAG prompt using both documents.
     */
    ragPrompt = buildRagPrompt({
      question: message,
      chunks: retrievedChunks,
    });

    /*
     * Return source information.
     */
    sources = retrievedChunks.map((chunk) => ({
      documentId: String(chunk.documentId),
      documentName:
        typeof chunk.metadata?.originalName === "string"
          ? chunk.metadata.originalName
          : "Unknown Document",
      chunkIndex: chunk.chunkIndex,
      score: chunk.score,
    }));

    console.log("===================================");
  }

  /*
   * ---------------------------------------------------------
   * 7. Build AI conversation
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
   * 8. Generate AI response
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
   * 9. Persist conversation
   * ---------------------------------------------------------
   */

  if (user && activeSessionId) {
    await Message.create([
      {
        sessionId: activeSessionId,
        userId: user.userId,
        role: "user",
        content: message,
        documentId: documentId ?? null,
      },
      {
        sessionId: activeSessionId,
        userId: user.userId,
        role: "assistant",
        content: reply,
        documentId: documentId ?? null,
      },
    ]);
  }

  /*
   * ---------------------------------------------------------
   * 10. Return response
   * ---------------------------------------------------------
   */

  return {
    reply,
    sessionId: activeSessionId,
    sources,
  };
}