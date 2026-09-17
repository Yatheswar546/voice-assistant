import { NextResponse } from "next/server";
import { generateEmbedding } from "@/lib/rag/embedding";

export async function GET() {
    try {
        const embedding = await generateEmbedding(
            "Amazon EC2 is a cloud computing service."
        );

        return NextResponse.json({
            success: true,
            dimensions: embedding.length,
            preview: embedding.slice(0, 5),
        });
    } catch (error) {
        console.error("Embedding Test Error:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Embedding generation failed.",
            },
            { status: 500 }
        );
    }
}