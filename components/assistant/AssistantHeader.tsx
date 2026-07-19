import AssistantStatus from "./AssistantStatus";

interface AssistantHeaderProps {
  isListening: boolean;
  isLoading: boolean;
  isSpeaking: boolean;
  onInterrupt: () => void;
}

export default function AssistantHeader({
  isListening,
  isLoading,
  isSpeaking,
  onInterrupt,
}: AssistantHeaderProps) {  
  return (
    <header className="flex h-24 items-center justify-between border-b border-white/10 px-10">
      {/* Left */}
      <div className="flex items-center gap-3">
        <h1 className="text-4xl font-semibold text-white">
          Assistant
        </h1>

        <span className="text-3xl text-gray-500">—</span>

        <AssistantStatus status="idle" />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button 
          className="rounded-full border border-white/20 px-6 py-2 transition hover:border-blue-400 hover:bg-white/5"
          onClick={onInterrupt}
          disabled={!isSpeaking}
        >  
          Interrupt
        </button>

        <button className="rounded-full border border-white/20 px-6 py-2 transition hover:border-blue-400 hover:bg-white/5">
          Exit
        </button>

        <button className="rounded-full border border-red-500 px-6 py-2 text-red-400 transition hover:bg-red-500/10">
          Quit
        </button>
      </div>
    </header>
  );
}