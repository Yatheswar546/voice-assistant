import { Bot } from "lucide-react";

export default function AssistantAvatar() {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-700 shadow-[0_0_20px_rgba(59,130,246,0.35)]">
      <Bot
        size={24}
        className="text-white"
      />
    </div>
  );
}