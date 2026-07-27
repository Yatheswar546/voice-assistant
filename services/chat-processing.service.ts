import { ai } from "@/lib/gemini";
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

  console.log("User message saved.");
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

  console.log("Assistant message saved.");
}

async function getConversationHistory(sessionId: string) {
  const messages = await Message.find({ sessionId })
    .sort({ createdAt: 1 })
    .lean();

  console.log("Conversation History:", messages);

  return messages;
}

export async function processChat({
  message,
  sessionId,
}: ProcessChatParams): Promise<ProcessChatResponse> {

  // Get logged-in user (null for guests)
  const user = await getAuthenticatedUser();

  console.log("Authenticated User:", user);

  let currentSessionId = sessionId ?? null;

  // Create a new chat session for logged-in users
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

    console.log("New Chat Session Created:", currentSessionId);
  }

  if (currentSessionId) {
    await saveUserMessage(currentSessionId, message);
  }

  let conversationHistory = [];

  if (currentSessionId) {
    conversationHistory = await getConversationHistory(currentSessionId);
  }

  // Send message to Gemini
  const response = await ai.models.generateContent({
    model: AI_CONFIG.MODEL,
    contents: message,
  });

  const reply = response.text;

  if (currentSessionId) {
    await saveAssistantMessage(
      currentSessionId,
      reply
    );
  }

  return {
    reply,
    sessionId: currentSessionId,
  };
}