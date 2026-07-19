import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/gemini";
import { AI_CONFIG } from "@/settings/ai.config";

export async function POST(req: NextRequest) {
    try {
        // Read the request body
        const { message } = await req.json();

        // Validate the input
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

        // Send the message to Gemini
        const response = await ai.models.generateContent({
            model: AI_CONFIG.MODEL,
            contents: message,
        });

        // Return the AI response
        return NextResponse.json({
            reply: response.text,
        });

    } catch (error: any) {
        console.error("Gemini API Error:", error);

        return NextResponse.json(
            {
                error: error?.message || String(error),
            },
            {
                status: 500,
            }
        );
    }
}