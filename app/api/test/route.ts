import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST() {
    try {
        // Connect to MongoDB
        await connectDB();

        console.log("Before creation ");
        
        // Create a test user
        const user = await User.create({
            name: "Test User 2",
            email: "test2@example.com",
            password: "password12345",
        });

        console.log("User: ", user);

        // Return success response
        return NextResponse.json(
            {
                success: true,
                message: "User created successfully!",
                user,
            },
            { status: 201 }
        );
    } catch (error) {
        
        console.error("Error creating user:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create user",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}