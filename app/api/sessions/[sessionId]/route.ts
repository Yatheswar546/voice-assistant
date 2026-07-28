import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { ChatSession } from "@/models/ChatSession";
import { Message } from "@/models/Message";

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ sessionId: string }>;
  }
) {
  try {
    await connectDB();

    const { sessionId } = await params;

    await Message.deleteMany({
      sessionId,
    });

    const deletedSession =
      await ChatSession.findByIdAndDelete(sessionId);

    if (!deletedSession) {
      return NextResponse.json(
        {
          error: "Session not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      message: "Session deleted successfully.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to delete session.",
      },
      {
        status: 500,
      }
    );
  }
}