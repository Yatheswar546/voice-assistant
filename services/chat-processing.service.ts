import { generateChatCompletion } from "@/lib/ai";
import { getAuthenticatedUser } from "@/lib/auth";
import { retrieveRelevantChunks } from "@/lib/rag/retriever";
import { buildRagPrompt } from "@/lib/rag/prompt-builder";
import { ChatSession } from "@/models/ChatSession";
import { Message } from "@/models/Message";
import { AI_CONFIG } from "@/settings/ai.config";

interface ProcessChatParams {
  message: string;
  sessionId?: string | null;
}

interface ProcessChatResponse {
  reply: string;
  sessionId: string | null;
}

async function saveUserMessage(
  sessionId: string,
  message: string
) {
  await Message.create({
    sessionId,
    role: "user",
    content: message,
  });
}

async function saveAssistantMessage(
  sessionId: string,
  message: string
) {
  await Message.create({
    sessionId,
    role: "assistant",
    content: message,
  });
}

async function getConversationHistory(sessionId: string) {
  const messages = await Message.find({ sessionId })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return messages.reverse();
}

function convertMessagesToAIHistory(
  messages: any[]
): Array<{
  role: "user" | "assistant" | "system";
  content: string;
}> {
  return messages.map((message) => ({
    role: message.role === "assistant" ? "assistant" : "user",
    content: message.content,
  }));
}

export async function processChat({
  message,
  sessionId,
}: ProcessChatParams): Promise<ProcessChatResponse> {
  const user = await getAuthenticatedUser();

  if (!message?.trim()) {
    throw new Error("Message cannot be empty.");
  }

  let currentSessionId = sessionId ?? null;

  // --------------------------------------------------
  // 1. Verify existing session ownership
  // --------------------------------------------------

  if (currentSessionId) {
    if (!user) {
      throw new Error("Unauthorized");
    }

    const session = await ChatSession.findOne({
      _id: currentSessionId,
      userId: user.userId,
    });

    if (!session) {
      throw new Error("Session not found.");
    }
  }

  // --------------------------------------------------
  // 2. Create a new session for signed-in users
  // --------------------------------------------------

  if (user && !currentSessionId) {
    const title =
      message.length > 50
        ? message.substring(0, 50) + "..."
        : message;

    const session = await ChatSession.create({
      userId: user.userId,
      title,
    });

    currentSessionId = session._id.toString();
  }

  // --------------------------------------------------
  // 3. Get previous conversation history
  // --------------------------------------------------

  let conversationHistory: any[] = [];

  if (currentSessionId) {
    conversationHistory =
      await getConversationHistory(currentSessionId);
  }

  // --------------------------------------------------
  // 4. Retrieve relevant document chunks
  // --------------------------------------------------

  let ragPrompt = message;

  if (user) {
    const retrievedChunks = await retrieveRelevantChunks({
      query: message,
      userId: user.userId,
      limit: 5,
    });

    ragPrompt = buildRagPrompt({
      question: message,
      chunks: retrievedChunks,
    });
  }

  // --------------------------------------------------
  // 5. Build AI conversation
  // --------------------------------------------------

  const aiMessages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }> = [
    ...convertMessagesToAIHistory(conversationHistory),
    {
      role: "user",
      content: ragPrompt,
    },
  ];

  // --------------------------------------------------
  // 6. Generate AI response
  // --------------------------------------------------

  const reply = await generateChatCompletion({
    model: AI_CONFIG.MODEL,
    messages: aiMessages,
    temperature: AI_CONFIG.TEMPERATURE,
    maxOutputTokens: AI_CONFIG.MAX_OUTPUT_TOKENS,
  });

  // --------------------------------------------------
  // 7. Persist messages
  // --------------------------------------------------

  if (currentSessionId) {
    await saveUserMessage(currentSessionId, message);
    await saveAssistantMessage(currentSessionId, reply);
  }

  // --------------------------------------------------
  // 8. Return response
  // --------------------------------------------------

  return {
    reply,
    sessionId: currentSessionId,
  };
}