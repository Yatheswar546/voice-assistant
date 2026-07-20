"use client";

import { useVoiceSettings } from "@/hooks/useVoiceSettings";

export default function PitchSlider() {
  const { settings, updateSettings } = useVoiceSettings();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="pitch"
          className="text-sm font-medium text-white"
        >
          Speech Pitch
        </label>

        <span className="text-sm text-gray-400">
          {settings.pitch.toFixed(1)}x
        </span>
      </div>

      <input
        id="pitch"
        type="range"
        min={0}
        max={2}
        step={0.1}
        value={settings.pitch}
        onChange={(e) =>
          updateSettings({
            pitch: Number(e.target.value),
          })
        }
        className="w-full cursor-pointer"
      />

      <div className="flex justify-between text-xs text-gray-500">
        <span>0.0</span>
        <span>1.0</span>
        <span>2.0</span>
      </div>
    </div>
  );
}