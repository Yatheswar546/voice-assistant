import { ai } from "@/lib/gemini";
import { getAuthenticatedUser } from "@/lib/auth";
import { ChatSession } from "@/models/ChatSession";
import { AI_CONFIG } from "@/settings/ai.config";

interface ProcessChatParams {
  message: string;
  sessionId?: string | null;
}

interface ProcessChatResponse {
  reply: string;
  sessionId: string | null;
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

  // Send message to Gemini
  const response = await ai.models.generateContent({
    model: AI_CONFIG.MODEL,
    contents: message,
  });

  return {
    reply: response.text,
    sessionId: currentSessionId,
  };
}