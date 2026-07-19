"use client";

import AssistantHeader from "@/components/assistant/AssistantHeader";
import ChatWindow from "@/components/chat/ChatWindow";
import VoiceInput from "@/components/voice/VoiceInput";
import { useState } from "react";
import type { ChatMessage } from "@/types/chat";
import { sendMessage } from "@/services/chat.service";

export default function MainContent() {

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    const trimmedMessage = input.trim();

    if (!trimmedMessage) return;

    const newMessage: ChatMessage = {
      role: "user",
      message: trimmedMessage,
    };

    setMessages((prev) => [...prev, newMessage]);

    setInput("");

    try {

      setIsLoading(true);

      const response = await sendMessage({
        message: trimmedMessage,
      });

      const assistantMessage: ChatMessage = {
        role: "assistant",
        message: response.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      setIsLoading(false);

    } catch (error) {

      setIsLoading(false);

      console.error(error);

      const assistantMessage: ChatMessage = {
        role: "assistant",
        message: "Sorry, something went wrong.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }

  };

  return (
    <main className="flex flex-1 flex-col">
      <AssistantHeader />

      <div className="flex-1 overflow-hidden">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
        />
      </div>

      <VoiceInput
        input={input}
        onInputChange={setInput}
        onSend={handleSendMessage}
        isLoading={isLoading}
      />
    </main>
  );
}