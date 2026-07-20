"use client";

import { useVoiceSettings } from "@/hooks/useVoiceSettings";

export default function RateSlider() {
  const { settings, updateSettings } = useVoiceSettings();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="rate"
          className="text-sm font-medium text-white"
        >
          Speech Rate
        </label>

        <span className="text-sm text-gray-400">
          {settings.rate.toFixed(1)}x
        </span>
      </div>

      <input
        id="rate"
        type="range"
        min={0.5}
        max={2}
        step={0.1}
        value={settings.rate}
        onChange={(e) =>
          updateSettings({
            rate: Number(e.target.value),
          })
        }
        className="w-full cursor-pointer"
      />

      <div className="flex justify-between text-xs text-gray-500">
        <span>0.5x</span>
        <span>1.0x</span>
        <span>2.0x</span>
      </div>
    </div>
  );
}