"use client";

interface PreviewButtonProps {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
}

export default function PreviewButton({
  speak,
  stop,
  isSpeaking,
}: PreviewButtonProps) {

  const handlePreview = () => {

    stop();

    speak(
      "Hello! This is how I will sound with your current voice settings."
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