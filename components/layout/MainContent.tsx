"use client";

import { useEffect, useState } from "react";

import AssistantHeader from "@/components/assistant/AssistantHeader";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/input/ChatInput";
import SettingsPanel from "../voice/SettingsPanel";

import type { ChatMessage } from "@/types/chat";

import { sendMessage } from "@/services/chat.service";

import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

import { useChat } from "@/context/ChatContext";

interface MainContentProps {
  onOpenSidebar: () => void;
}

export default function MainContent({
  onOpenSidebar,
}: MainContentProps) {
  const [input, setInput] = useState("");

  // Stores the document currently selected for RAG questions.
  const [activeDocumentId, setActiveDocumentId] =
    useState<string | null>(null);

  const {
    messages,
    setMessages,
    activeSessionId,
    setActiveSessionId,
    isLoading,
    setIsLoading,
    loadSessions,
  } = useChat();

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

  /**
   * When the user starts a new chat,
   * remove the previously selected document.
   *
   * This prevents a document from the previous chat
   * accidentally becoming active in the new chat.
   */
  useEffect(() => {
    if (activeSessionId === null) {
      setActiveDocumentId(null);
    }
  }, [activeSessionId]);

  /**
   * Called by ChatInput after a document is
   * successfully uploaded.
   */
  const handleDocumentUploaded = (
    documentId: string,
    fileName: string
  ) => {
    console.log("Document uploaded successfully.");
    console.log("Document name:", fileName);
    console.log("Active document ID:", documentId);

    setActiveDocumentId(documentId);
  };

  const handleSendMessage = async () => {
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
        sessionId: activeSessionId ?? undefined,

        // Send the currently active document to the backend.
        documentId: activeDocumentId ?? undefined,
      });

      if (
        !activeSessionId &&
        assistantResponse.sessionId
      ) {
        setActiveSessionId(assistantResponse.sessionId);
        await loadSessions();
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        message: assistantResponse.reply,
      };

      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);

      speak(assistantResponse.reply);
    } catch (error) {
      const assistantMessage: ChatMessage = {
        role: "assistant",
        message:
          error instanceof Error
            ? error.message
            : "Unexpected error occurred.",
      };

      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
      <AssistantHeader
        isListening={isListening}
        isLoading={isLoading}
        isSpeaking={isSpeaking}
        onInterrupt={stop}
        onOpenSettings={() =>
          setIsSettingsOpen(true)
        }
        onOpenSidebar={onOpenSidebar}
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
        onDocumentUploaded={handleDocumentUploaded}
      />
    </main>
  );
}