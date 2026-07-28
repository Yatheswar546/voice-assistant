import { ChatSession } from "@/models/ChatSession";
import { Message } from "@/models/Message";

export async function getUserSessions(
  userId: string
) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  return await ChatSession.find({
    userId,
  })
    .sort({
      updatedAt: -1,
    })
    .lean();
}

export async function getSessionMessages(
  sessionId: string,
  userId: string
) {
  if (!sessionId) {
    throw new Error("Session ID is required.");
  }

  if (!userId) {
    throw new Error("User ID is required.");
  }

  const session = await ChatSession.findOne({
    _id: sessionId,
    userId,
  });

  if (!session) {
    throw new Error("Session not found.");
  }

  return await Message.find({
    sessionId,
  })
    .sort({
      createdAt: 1,
    })
    .lean();
}