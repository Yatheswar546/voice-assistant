"use client";

import { useVoiceSettings } from "@/hooks/useVoiceSettings";

export default function AutoSpeakToggle() {
  const { settings, updateSettings } = useVoiceSettings();

  return (
    <div className="flex items-center justify-between rounded-lg border border-white/10 p-4">
      <div>
        <h3 className="text-sm font-medium text-white">
          Auto Speak
        </h3>

        <p className="text-xs text-gray-400">
          Automatically read AI responses aloud.
        </p>
      </div>

      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          checked={settings.autoSpeak}
          onChange={(e) =>
            updateSettings({
              autoSpeak: e.target.checked,
            })
          }
          className="peer sr-only"
        />

        <div
          className="
            h-6 w-11 rounded-full
            bg-gray-600
            transition-colors
            peer-checked:bg-blue-600

            after:absolute
            after:left-[2px]
            after:top-[2px]
            after:h-5
            after:w-5
            after:rounded-full
            after:bg-white
            after:transition-transform

            peer-checked:after:translate-x-5
          "
        />
      </label>
    </div>
  );
}