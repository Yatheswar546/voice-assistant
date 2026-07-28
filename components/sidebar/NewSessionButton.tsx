"use client";

import { Plus } from "lucide-react";
import { useChat } from "@/context/ChatContext";

export default function NewSessionButton() {
  const {
    setMessages,
    setActiveSessionId,
  } = useChat();

  const handleNewSession = () => {
    setMessages([]);
    setActiveSessionId(null);
  };

  return (
    <button
      onClick={handleNewSession}
      className="flex w-full items-center gap-3 rounded-xl border border-white/15 px-5 py-4 text-lg transition-all hover:border-blue-400 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <Plus size={22} />
      <span>New Session</span>
    </button>
  );
}