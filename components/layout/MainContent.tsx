"use client";

import AssistantHeader from "@/components/assistant/AssistantHeader";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/input/ChatInput";
import { useState } from "react";
import type { ChatMessage } from "@/types/chat";
import { sendMessage } from "@/services/chat.service";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import SettingsPanel from "../voice/SettingsPanel";

export default function MainContent() {

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    isListening,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    onTranscript: setInput,
  });

  const {
    speak,
    stop,
    isSpeaking,
    voices,
  } = useSpeechSynthesis();

  const handleSendMessage = async () => {

    // Prevent duplicate requests
    if (isLoading) return;

    const trimmedMessage = input.trim();

    if (!trimmedMessage) return;

    const newMessage: ChatMessage = {
      role: "user",
      message: trimmedMessage,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const assistantResponse = await sendMessage({
        message: trimmedMessage,
      });

      const assistantMessage: ChatMessage = {
        role: "assistant",
        message: assistantResponse.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      speak(assistantResponse.reply);

    } catch (error) {

      console.error(error);

      const assistantMessage: ChatMessage = {
        role: "assistant",
        message:
          error instanceof Error
            ? error.message
            : "Unexpected error occurred.",
      };

      setMessages((prev) => [...prev, assistantMessage]);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col">
      <AssistantHeader
        isListening={isListening}
        isLoading={isLoading}
        isSpeaking={isSpeaking}
        onInterrupt={stop}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        voices={voices}
        speak={speak}
        stop={stop}
        isSpeaking={isSpeaking}
      />

      <div className="flex-1 overflow-hidden">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
        />
      </div>

      <ChatInput
        input={input}
        onInputChange={setInput}
        onSend={handleSendMessage}
        isLoading={isLoading}
        isListening={isListening}
        startListening={startListening}
        stopListening={stopListening}
      />
    </main>
  );
}