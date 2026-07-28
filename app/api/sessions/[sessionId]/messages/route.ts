import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSessionMessages } from "@/services/session-processing.service";

interface RouteParams {
  params: Promise<{
    sessionId: string;
  }>;
}

export async function GET(
  req: NextRequest,
  { params }: RouteParams
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

    const messages = await getSessionMessages(
      sessionId,
      user.userId
    );

    return NextResponse.json(messages);

  } catch (error: any) {

    console.error("Session Messages API Error:", error);

    return NextResponse.json(
      {
        error: error?.message || "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}