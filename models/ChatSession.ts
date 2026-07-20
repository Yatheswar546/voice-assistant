import mongoose, { Schema, model, models } from "mongoose";

const ChatSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ChatSession =
  models.ChatSession ||
  model("ChatSession", ChatSessionSchema);