import { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "ChatSession",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Message =
  models.Message || model("Message", MessageSchema);