import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth";
import { getUserById } from "@/services/auth.service";

export async function GET() {
  try {
    // Verify JWT from the auth-token cookie
    const payload = await getAuthenticatedUser();

    // Fetch the user from MongoDB
    const user = await getUserById(payload.userId);

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("GET /api/auth/me Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      {
        status: 401,
      }
    );
  }
}