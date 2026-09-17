import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth";
import { retrieveRelevantChunks } from "@/lib/rag/retriever";

export async function GET(request: Request) {
    try {
        const payload = await getAuthenticatedUser();

        if (!payload) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");

        if (!query?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Query parameter 'q' is required.",
                },
                { status: 400 }
            );
        }

        const results = await retrieveRelevantChunks({
            query,
            userId: payload.userId,
            limit: 5,
        });

        return NextResponse.json({
            success: true,
            query,
            count: results.length,
            results,
        });
    } catch (error) {
        console.error("Retrieval Test Error:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Retrieval failed.",
            },
            { status: 500 }
        );
    }
}