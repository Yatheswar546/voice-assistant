import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/lib/auth";
import { getUserSessions } from "@/services/session-processing.service";

export async function GET() {
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

    const sessions = await getUserSessions(user.userId);

    return NextResponse.json(sessions);

  } catch (error: any) {

    console.error("Sessions API Error:", error);

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