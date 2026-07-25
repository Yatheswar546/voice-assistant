import { X } from "lucide-react";
import VoiceSelector from "./VoiceSelector";
import RateSlider from "./RateSlider";
import PitchSlider from "./PitchSlider";
import VolumeSlider from "./VolumeSlider";
import AutoSpeakToggle from "./AutoSpeakToggle";
import PreviewButton from "./PreviewButton";
import ResetVoiceButton from "./ResetVoiceButton";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  voices: SpeechSynthesisVoice[];
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
}

export default function SettingsPanel({
  isOpen,
  onClose,
  voices,
  speak,
  stop,
  isSpeaking,
}: SettingsPanelProps) {
  return (
    <div
      className={`fixed top-0 right-0 z-50 h-screen w-full max-w-md border-l border-white/10 bg-[#111217] shadow-[-20px_0_60px_rgba(0,0,0,0.35)] transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/10 p-6">
        <h2 className="text-2xl font-semibold">Settings</h2>
        <button
          onClick={onClose}
          aria-label="Close settings"
          className="rounded-full border border-white/15 p-2 text-slate-300 transition hover:border-blue-400 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-5 p-6">
        <VoiceSelector voices={voices} />
        <RateSlider />
        <PitchSlider />
        <VolumeSlider />
        <AutoSpeakToggle />
        <PreviewButton speak={speak} stop={stop} isSpeaking={isSpeaking} />
        <ResetVoiceButton />
      </div>
    </div>
  );
}
