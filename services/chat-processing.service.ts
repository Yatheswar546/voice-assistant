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

function convertMessagesToGeminiHistory(messages: any[]) {
  return messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [
      {
        text: message.content,
      },
    ],
  }));
}

export async function processChat({
  message,
  sessionId,
}: ProcessChatParams): Promise<ProcessChatResponse> {

  // Get logged-in user (null for guests)
  const user = await getAuthenticatedUser();

  // console.log("Authenticated User:", user);

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

    // console.log("New Chat Session Created:", currentSessionId);
  }

  if (currentSessionId) {
    await saveUserMessage(currentSessionId, message);
  }

  let conversationHistory = [];

  if (currentSessionId) {
    conversationHistory = await getConversationHistory(currentSessionId);
  }

  const geminiConversationHistory =
    convertMessagesToGeminiHistory(conversationHistory);

  // console.log(
  //   "Gemini Conversation History:",
  //   JSON.stringify(geminiConversationHistory, null, 2)
  // );

  // If there is no conversation history (guest user's first message),
  // send the current message directly to Gemini.
  const contents =
      geminiConversationHistory.length > 0
        ? geminiConversationHistory
        : [
            {
              role: "user",
              parts: [
                {
                  text: message,
                },
              ],
            },
        ];

  // Send message to Gemini
  const response = await ai.models.generateContent({
    model: AI_CONFIG.MODEL,
    contents: geminiConversationHistory,
  });

  const reply = response.text ?? "Sorry, I couldn't generate a response.";

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