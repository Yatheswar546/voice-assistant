"use client";

import { useVoiceSettings } from "@/hooks/useVoiceSettings";

interface VoiceSelectorProps {
  voices: SpeechSynthesisVoice[];
}

export default function VoiceSelector({
  voices,
}: VoiceSelectorProps) {
  const { settings, updateSettings } = useVoiceSettings();

  return (
    <div className="space-y-2">
      <label
        htmlFor="voice"
        className="block text-sm font-medium text-white"
      >
        Voice
      </label>

      <select
        id="voice"
        value={settings.voiceURI}
        onChange={(e) =>
          updateSettings({
            voiceURI: e.target.value,
          })
        }
        className="w-full rounded-lg border border-white/20 bg-neutral-900 px-4 py-2 text-white outline-none focus:border-blue-500"
      >
        <option value="">Default Voice</option>

        {voices.map((voice) => (
          <option
            key={voice.voiceURI}
            value={voice.voiceURI}
          >
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>
    </div>
  );
}