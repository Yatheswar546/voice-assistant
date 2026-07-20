import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
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
}

export default function SettingsPanel({
  isOpen,
  onClose,
  // voices,
}: SettingsPanelProps) {

  const { voices } = useSpeechSynthesis();
  
  return (

    <div
      className={`
        fixed
        top-0
        right-0
        h-screen
        w-full
        max-w-md
        bg-[#202127]
        shadow-xl
        transition-transform
        duration-300
        z-50
        ${
          isOpen
            ? "translate-x-0"
            : "translate-x-full"
        }
      `}
    >
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold">
          Settings
        </h2>

        <button onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="space-y-5 p-6">
        <VoiceSelector voices={voices} />

        <RateSlider />

        <PitchSlider />

        <VolumeSlider />

        <AutoSpeakToggle />

        <PreviewButton />

        <ResetVoiceButton />

      </div>
    </div>
  );
}