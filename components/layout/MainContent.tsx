"use client";

import AssistantHeader from "@/components/assistant/AssistantHeader";
import ChatWindow from "@/components/chat/ChatWindow";
import VoiceInput from "@/components/voice/VoiceInput";
import { useState } from "react";
import type { ChatMessage } from "@/types/chat";

export default function MainContent() {

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "user",
      message: "What is the weather like tomorrow?",
    },
    {
      role: "assistant",
      category: "Weather",
      message:
        "Tomorrow will be sunny with a high of 23°C (73°F). A light breeze from the west is expected.",
    },
    {
      role: "user",
      message: "Can you set a reminder for 9 AM?",
    },
    {
      role: "assistant",
      category: "Reminder",
      message: "Okay, setting a reminder for tomorrow at 9 AM.",
    },
  ]);

  const handleSendMessage = () => {
    const trimmedMessage = input.trim();

    if (!trimmedMessage) return;

    const newMessage: ChatMessage = {
      role: "user",
      message: trimmedMessage,
    };

    setMessages((prev) => [...prev, newMessage]);

    setInput("");
  };

  return (
    <main className="flex flex-1 flex-col">
      <AssistantHeader />

      <div className="flex-1 overflow-hidden">
        <ChatWindow messages={messages} />
      </div>

      <VoiceInput
        input={input}
        onInputChange={setInput}
        onSend={handleSendMessage}
      />
    </main>
  );
}