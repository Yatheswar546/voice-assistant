import { ChatSession } from "@/models/ChatSession";

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