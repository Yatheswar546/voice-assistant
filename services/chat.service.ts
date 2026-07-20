import type { ChatRequest, ChatResponse, ApiError } from "@/types/api";

export async function sendMessage(
  request: ChatRequest
): Promise<ChatResponse> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new Error("Invalid request.");

        case 401:
          throw new Error("Invalid API key.");

        case 403:
          throw new Error("Access denied.");

        case 404:
          throw new Error("Service not found.");

        case 429:
          throw new Error(
            "API quota exceeded. Please try again later."
          );

        case 500:
          throw new Error(
            "Server error. Please try again later."
          );

        default:
          throw new Error(
            (data as ApiError).error ||
            "Something went wrong."
          );
      }
    }

    return data as ChatResponse;
  } catch (error) {
    if (!navigator.onLine) {
      throw new Error(
        "No internet connection. Please check your network."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unexpected error occurred.");
  }
}