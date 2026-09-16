import { Schema, model, models } from "mongoose";

const DocumentChunkSchema = new Schema(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    chunkIndex: {
      type: Number,
      required: true,
      min: 0,
    },

    embedding: {
      type: [Number],
      required: true,
    },

    metadata: {
      pageNumber: {
        type: Number,
        default: null,
      },
      sheetName: {
        type: String,
        default: null,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

DocumentChunkSchema.index({ documentId: 1, chunkIndex: 1 }, { unique: true });
DocumentChunkSchema.index({ userId: 1, documentId: 1 });

export const DocumentChunk =
  models.DocumentChunk || model("DocumentChunk", DocumentChunkSchema);
