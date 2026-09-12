import { generateChatCompletion } from "@/lib/ai";
import { getAuthenticatedUser } from "@/lib/auth";
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

  // console.log("User message saved.");
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

  // console.log("Assistant message saved.");
}

async function getConversationHistory(sessionId: string) {
  const messages = await Message.find({ sessionId })
    .sort({ createdAt: -1 }) // Newest first
    .limit(20)               // Keep only the latest 20 messages
    .lean();

  // Reverse so Gemini receives the conversation
  // from oldest to newest.
  const orderedMessages = messages.reverse();

  // console.log("Conversation History:", orderedMessages);

  return orderedMessages;
}

function convertMessagesToAIHistory(
  messages: any[]
): Array<{ role: "user" | "assistant" | "system"; content: string }> {
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

  let currentSessionId = sessionId ?? null;

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

  if (currentSessionId) {
    await saveUserMessage(currentSessionId, message);
  }

  let conversationHistory: any[] = [];

  if (currentSessionId) {
    conversationHistory = await getConversationHistory(currentSessionId);
  }

  const aiMessages: Array<{ role: "user" | "assistant" | "system"; content: string }> = [
    ...convertMessagesToAIHistory(conversationHistory),
    {
      role: "user",
      content: message,
    },
  ];

  const reply = await generateChatCompletion({
    model: AI_CONFIG.MODEL,
    messages: aiMessages,
    temperature: AI_CONFIG.TEMPERATURE,
    maxOutputTokens: AI_CONFIG.MAX_OUTPUT_TOKENS,
  });

  if (currentSessionId) {
    await saveAssistantMessage(currentSessionId, reply);
  }

  return {
    reply,
    sessionId: currentSessionId,
  };
}