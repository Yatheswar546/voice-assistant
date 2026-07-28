import type { ChatMessage } from "@/types/chat";

interface MessageResponse {
  role: "user" | "assistant";
  content: string;
}

export async function getSessionMessages(
  sessionId: string
): Promise<ChatMessage[]> {

  const response = await fetch(
    `/api/sessions/${sessionId}/messages`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load messages.");
  }

  const messages: MessageResponse[] = await response.json();

  return messages.map((msg) => ({
    role: msg.role,
    message: msg.content,
  }));
}