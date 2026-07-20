"use client";

import { useState } from "react";
import { useVoiceSettings } from "@/hooks/useVoiceSettings";

export default function ResetVoiceButton() {
  const { resetSettings } = useVoiceSettings();

  const [confirming, setConfirming] = useState(false);

  const handleConfirm = () => {
    resetSettings();
    setConfirming(false);
  };

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
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

  return (
    <div className="space-y-3 rounded-lg border border-red-500/30 p-4">
      <p className="text-center text-sm text-gray-300">
        Are you sure you want to reset all voice settings?
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => setConfirming(false)}
          className="
            flex-1
            rounded-lg
            border
            border-gray-500
            px-4
            py-2
            text-gray-300
            transition
            hover:bg-gray-700
          "
        >
          Cancel
        </button>

        <button
          onClick={handleConfirm}
          className="
            flex-1
            rounded-lg
            bg-red-600
            px-4
            py-2
            text-white
            transition
            hover:bg-red-700
          "
        >
          Confirm
        </button>
      </div>
    </div>
  );
}