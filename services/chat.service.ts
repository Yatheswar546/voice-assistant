import type { ChatRequest, ChatResponse, ApiError } from "@/types/api";

export async function sendMessage(
  request: ChatRequest
): Promise<ChatResponse> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error((data as ApiError).error);
  }

  return data as ChatResponse;
}