import type { VoiceSettings } from "@/types/voice";

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  voiceURI: "",
  rate: 1,
  pitch: 1,
  volume: 1,
  autoSpeak: true,
};

export const VOICE_SETTINGS_STORAGE_KEY = "voice-settings";