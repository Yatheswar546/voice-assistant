import VoiceButton from "./VoiceButton";

export default function VoiceInput() {
  return (
    <footer className="border-t border-white/10 px-10 py-6">
      <div className="flex items-center gap-5 rounded-full border border-white/10 bg-[#16171D] px-6 py-4 shadow-lg">
        <input
          type="text"
          placeholder="Type, or press the mic to speak..."
          className="flex-1 bg-transparent text-lg text-white placeholder:text-gray-500 focus:outline-none"
        />

        <VoiceButton />
      </div>
    </footer>
  );
}