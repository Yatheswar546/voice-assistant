"use client";

import { useContext } from "react";
import { VoiceSettingsContext } from "@/context/VoiceSettingsContext";

export function useVoiceSettings() {
  const context = useContext(VoiceSettingsContext);

  if (!context) {
    throw new Error(
      "useVoiceSettings must be used within a VoiceSettingsProvider."
    );
  }

  return context;
}