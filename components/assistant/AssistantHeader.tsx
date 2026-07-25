import { Settings } from "lucide-react";
import AssistantStatus from "./AssistantStatus";
import AuthButton from "../auth/AuthButton";

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
    <header className="flex min-h-24 items-center justify-between gap-6 border-b border-white/10 px-6 py-5 lg:px-12">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">
          Assistant
        </h1>
        <span className="text-3xl text-slate-500">—</span>
        <AssistantStatus status={status} />
      </div>

      <div className="flex items-center gap-3">
        <button
          className="hidden rounded-full border border-white/15 px-6 py-2.5 text-slate-300 transition hover:border-blue-400 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40 sm:inline-flex"
          onClick={onInterrupt}
          disabled={!isSpeaking}
        >
          Interrupt
        </button>

        <AuthButton />

        <button
          onClick={onOpenSettings}
          aria-label="Settings"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 transition hover:border-blue-400 hover:bg-white/5 sm:px-6"
        >
          <Settings size={18} />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </div>
    </header>
  );
}
