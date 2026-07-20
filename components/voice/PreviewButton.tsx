"use client";

import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

export default function PreviewButton() {
  const { speak, isSpeaking } = useSpeechSynthesis();

  const handlePreview = () => {
    speak(
      "Hello! This is a preview of your current voice settings."
    );
  };

  return (
    <button
      onClick={handlePreview}
      disabled={isSpeaking}
      className="
        w-full
        rounded-lg
        bg-blue-600
        px-4
        py-2
        text-white
        transition
        hover:bg-blue-700
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      {isSpeaking ? "Playing..." : "Preview Voice"}
    </button>
  );
}