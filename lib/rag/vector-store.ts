import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const VECTOR_INDEX_NAME = "document_chunks_vector_index";

interface VectorSearchOptions {
    userId: string;
    queryVector: number[];
    limit?: number;
    documentId?: string;
}

export async function searchSimilarChunks({
    userId,
    queryVector,
    limit = 5,
    documentId,
}: VectorSearchOptions) {
    const db = mongoose.connection.db;

    if (!db) {
        throw new Error("MongoDB database connection is not available.");
    }

    if (!queryVector.length) {
        throw new Error("Query vector cannot be empty.");
    }

    const userObjectId = new ObjectId(userId);

    const filter: Record<string, unknown> = {
        userId: userObjectId,
    };

    if (documentId) {
        filter.documentId = new ObjectId(documentId);
    }

    const pipeline = [
        {
            $vectorSearch: {
                index: VECTOR_INDEX_NAME,
                path: "embedding",
                queryVector,
                numCandidates: Math.max(limit * 20, 50),
                limit,
                filter,
            },
        },
        {
            $project: {
                _id: 1,
                documentId: 1,
                userId: 1,
                content: 1,
                chunkIndex: 1,
                metadata: 1,
                score: {
                    $meta: "vectorSearchScore",
                },
            },
        },
    ];

    const results = await db
        .collection("documentchunks")
        .aggregate(pipeline)
        .toArray();

    return results;
}