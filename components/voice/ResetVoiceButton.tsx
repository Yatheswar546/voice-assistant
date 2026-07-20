"use client";

import { useVoiceSettings } from "@/hooks/useVoiceSettings";

export default function ResetVoiceButton() {
  const { resetSettings } = useVoiceSettings();

  return (
    <button
      onClick={resetSettings}
      className="
        w-full
        rounded-lg
        border
        border-red-500
        px-4
        py-2
        text-red-400
        transition
        hover:bg-red-500/10
      "
    >
      Reset to Defaults
    </button>
  );
}