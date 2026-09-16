import { Schema, model, models } from "mongoose";

const DocumentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    mimeType: {
      type: String,
      required: true,
      trim: true,
    },

    size: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["uploaded", "processing", "completed", "failed"],
      default: "uploaded",
      required: true,
      index: true,
    },

    totalChunks: {
      type: Number,
      default: 0,
      min: 0,
    },

    errorMessage: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

DocumentSchema.index({ userId: 1, createdAt: -1 });

export const Document =
  models.Document || model("Document", DocumentSchema);
