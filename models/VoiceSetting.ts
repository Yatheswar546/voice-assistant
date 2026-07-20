import { Schema, model, models } from "mongoose";

const VoiceSettingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    voiceURI: {
      type: String,
      default: "",
    },

    rate: {
      type: Number,
      default: 1,
      min: 0.5,
      max: 2,
    },

    pitch: {
      type: Number,
      default: 1,
      min: 0,
      max: 2,
    },

    volume: {
      type: Number,
      default: 1,
      min: 0,
      max: 1,
    },

    autoSpeak: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const VoiceSetting =
  models.VoiceSetting ||
  model("VoiceSetting", VoiceSettingSchema);