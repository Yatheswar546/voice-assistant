"use client";

import AssistantHeader from "@/components/assistant/AssistantHeader";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/input/ChatInput";
import { useState } from "react";
import type { ChatMessage } from "@/types/chat";
import { sendMessage } from "@/services/chat.service";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

export default function MainContent() {

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [isLoading, setIsLoading] = useState(false);

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
  } = useSpeechSynthesis();

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

      const assistantResponse = await sendMessage({
        message: trimmedMessage,
      });

      const assistantMessage: ChatMessage = {
        role: "assistant",
        message: assistantResponse.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      speak(assistantResponse.reply);

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
      <AssistantHeader
        isListening={isListening}
        isLoading={isLoading}
        isSpeaking={isSpeaking}
        onInterrupt={stop}
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