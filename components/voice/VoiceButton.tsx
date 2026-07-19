import { Mic } from "lucide-react";

interface VoiceButtonProps {
  onSend: () => void;
  isLoading: boolean;
}

export default function VoiceButton({
  onSend,
  isLoading,
}: VoiceButtonProps) {
  return (
    <button
      onClick={onSend}
      disabled={isLoading}
      className="group flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-700 shadow-[0_0_30px_rgba(59,130,246,0.45)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_45px_rgba(59,130,246,0.7)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Mic
        size={28}
        className="text-white transition-transform group-hover:scale-110"
      />
    </button>
  );
}