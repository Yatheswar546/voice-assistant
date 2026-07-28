import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { processChat } from "@/services/chat-processing.service";

export async function POST(req: NextRequest) {
  try {

    await connectDB();

    const { message, sessionId } = await req.json();

    if (!message) {
      return NextResponse.json(
        {
          error: "Message is required.",
        },
        {
          status: 400,
        }
      );
    }

    const result = await processChat({
      message,
      sessionId,
    });

    return NextResponse.json(result);

  } catch (error: any) {

    // console.error("Chat API Error:", error);

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