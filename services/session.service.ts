import type { ChatSession } from "@/types/session";

export async function getSessions(): Promise<ChatSession[]> {
  try {
    const response = await fetch("/api/sessions");

    const data = await response.json();

    if (!response.ok) {
      switch (response.status) {
        case 401:
          throw new Error("Please login to view chat history.");

        case 500:
          throw new Error(
            "Unable to load chat history. Please try again."
          );

        default:
          throw new Error(
            data.error || "Something went wrong."
          );
      }
    }

    return data as ChatSession[];

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

export async function deleteSession(
  sessionId: string
): Promise<void> {

  try {

    const response = await fetch(
      `/api/sessions/${sessionId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {

      switch (response.status) {

        case 404:
          throw new Error("Chat not found.");

        case 500:
          throw new Error(
            "Unable to delete chat. Please try again."
          );

        default:
          throw new Error(
            data.error || "Something went wrong."
          );
      }
    }

  } catch (error) {

    if (!navigator.onLine) {
      throw new Error(
        "No internet connection."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "Unexpected error occurred."
    );
  }
}

export async function renameSession(
  sessionId: string,
  title: string
) {
  const response = await fetch(`/api/sessions/${sessionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to rename session.");
  }

  return response.json();
}