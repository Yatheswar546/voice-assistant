import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { connectDB } from "@/lib/mongodb";
import { RegisterSchema } from "@/schemas/auth.schema";
import { createUser } from "@/services/auth.service";

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    console.log(request.method);

    // Parse request body
    const body = await request.json();

    // Validate request
    const validatedData = RegisterSchema.parse(body);

    // Create user
    const user = await createUser(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully.",
        data: user,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    // Validation errors
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

    // Business logic errors
    if (error instanceof Error) {
      if (error.message === "User already exists") {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
          },
          {
            status: 409,
          }
        );
      }
    }

    console.error("Registration Error:", error);

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