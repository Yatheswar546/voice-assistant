import VoiceButton from "./VoiceButton";

interface VoiceInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export default function VoiceInput({
  input,
  onInputChange,
  onSend,
  isLoading,
}: VoiceInputProps) {
  return (
    <footer className="border-t border-white/10 px-10 py-6">
      <div className="flex items-center gap-5 rounded-full border border-white/10 bg-[#16171D] px-6 py-4 shadow-lg">
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
          className="flex-1 bg-transparent text-lg text-white placeholder:text-gray-500 focus:outline-none"
          disabled={isLoading}
        />

        <VoiceButton
          onSend={onSend}
          isLoading={isLoading}
        />
      </div>
    </footer>
  );
}