import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/lib/auth";
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

    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { sessionId } = await params;

    const deletedSession =
      await ChatSession.findOneAndDelete({
        _id: sessionId,
        userId: user.userId,
      });

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

    await Message.deleteMany({
      sessionId,
    });

    return NextResponse.json({
      message: "Session deleted successfully.",
    });

  } catch (error) {
    // console.error(error);

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

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ sessionId: string }>;
  }
) {
  try {
    await connectDB();

    const user = await getAuthenticatedUser();

    if(!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { sessionId } = await params;

    const { title } = await request.json();

    if (!title || !title.trim()) {
      return NextResponse.json(
        {
          error: "Title is required.",
        },
        {
          status: 400,
        }
      );
    }

    const updatedSession = await ChatSession.findOneAndUpdate(
      {
        _id: sessionId,
        userId: user.userId,
      },
      {
        title: title.trim(),
      },
      {
        new: true,
      }
    );

    if (!updatedSession) {
      return NextResponse.json(
        {
          error: "Session not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(updatedSession);

  } catch (error) {
    // console.error(error);

    return NextResponse.json(
      {
        error: "Failed to rename session.",
      },
      {
        status: 500,
      }
    );
  }
}