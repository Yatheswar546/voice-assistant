"use client";

import { useVoiceSettings } from "@/hooks/useVoiceSettings";

export default function VolumeSlider() {
  const { settings, updateSettings } = useVoiceSettings();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="volume"
          className="text-sm font-medium text-white"
        >
          Volume
        </label>

        <span className="text-sm text-gray-400">
          {(settings.volume * 100).toFixed(0)}%
        </span>
      </div>

      <input
        id="volume"
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={settings.volume}
        onChange={(e) =>
          updateSettings({
            volume: Number(e.target.value),
          })
        }
        className="w-full cursor-pointer"
      />

      <div className="flex justify-between text-xs text-gray-500">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
}