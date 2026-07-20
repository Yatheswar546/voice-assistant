import AssistantStatus from "./AssistantStatus";

interface AssistantHeaderProps {
  isListening: boolean;
  isLoading: boolean;
  isSpeaking: boolean;
  onInterrupt: () => void;
  onOpenSettings: () => void;
}

export default function AssistantHeader({
  isListening,
  isLoading,
  isSpeaking,
  onInterrupt,
  onOpenSettings,
}: AssistantHeaderProps) {

  const status = isListening
    ? "listening"
    : isLoading
      ? "thinking"
      : isSpeaking
        ? "speaking"
        : "idle";

  return (
    <header className="flex h-24 items-center justify-between border-b border-white/10 px-10">
      {/* Left */}
      <div className="flex items-center gap-3">
        <h1 className="text-4xl font-semibold text-white">
          Assistant
        </h1>

        <span className="text-3xl text-gray-500">—</span>

        <AssistantStatus status={status} />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button
          className="rounded-full border border-white/20 px-6 py-2 transition hover:border-blue-400 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onInterrupt}
          disabled={!isSpeaking}
        >
          Interrupt
        </button>

        {/* <button className="rounded-full border border-white/20 px-6 py-2 transition hover:border-blue-400 hover:bg-white/5">
          Exit
        </button> */}

        <button className="rounded-full border border-red-500 px-6 py-2 text-red-400 transition hover:bg-red-500/10">
          Logout
        </button>

        <button
          onClick={onOpenSettings}
          aria-label="Settings"
          className="rounded-full border border-white/20 px-6 py-2 transition hover:border-blue-400 hover:bg-white/5"
        >
          ⚙️ Settings
        </button>
      </div>
    </header>
  );
}