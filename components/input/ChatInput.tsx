import VoiceButton from "./VoiceButton";

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
}

export default function ChatInput({
  input,
  onInputChange,
  onSend,
  isLoading,

  isListening,
  startListening,
  stopListening,
}: ChatInputProps) {
  return (
    <footer className="border-t border-white/10 px-4 py-2 lg:px-12 lg:py-4">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#16171D] px-4 py-2 shadow-[0_16px_45px_rgba(0,0,0,0.22)] lg:gap-4 lg:px-8 lg:py-3">

        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading) {
              onSend();
            }
          }}
          placeholder="Type, or press the mic to speak..."
          className="flex-1 bg-transparent text-sm lg:text-lg text-white placeholder:text-gray-500 focus:outline-none"
          disabled={isLoading}
        />

        <VoiceButton
          isLoading={isLoading}
          isListening={isListening}
          startListening={startListening}
          stopListening={stopListening}
        />

      </div>
    </footer>
  );
}
