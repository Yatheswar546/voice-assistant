import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { connectDB } from "@/lib/mongodb";
import { LoginSchema } from "@/schemas/auth.schema";
import { loginUser } from "@/services/auth.service";

export async function POST(request: NextRequest) {

  console.log("🔥 LOGIN ROUTE HIT");

  try {
    await connectDB();

    const body = await request.json();

    const validatedData = LoginSchema.parse(body);

    const result = await loginUser(validatedData);

    console.log(result.token);

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        data: {
            user: result.user,
            token: result.token,
        },
      },
      {
        status: 200,
      }
    );

    // Store JWT in HTTP-only Cookie
    response.cookies.set({
        name: "token",
        value: result.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60*60*24*7,
        path: "/",
    });

    console.log("🔥 Returning response with cookie");
    
    return response;

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: error.issues,
        },
        {
          status: 400,
        }
      );
    }

    if (
      error instanceof Error &&
      error.message === "Invalid email or password"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 401,
        }
      );
    }

    console.error("Login Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}