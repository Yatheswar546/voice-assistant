"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import type { ChatMessage } from "@/types/chat";
import type { ChatSession } from "@/types/session";

interface ChatContextType {
  messages: ChatMessage[];
  setMessages: React.Dispatch<
    React.SetStateAction<ChatMessage[]>
  >;

  sessions: ChatSession[];
  setSessions: React.Dispatch<
    React.SetStateAction<ChatSession[]>
  >;

  activeSessionId?: string;
  setActiveSessionId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;

  isLoading: boolean;
  setIsLoading: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  clearChat: () => void;
}

const ChatContext = createContext<
  ChatContextType | undefined
>(undefined);

export function ChatProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [sessions, setSessions] = useState<ChatSession[]>([]);

  const [activeSessionId, setActiveSessionId] =
    useState<string>();

  const [isLoading, setIsLoading] = useState(false);

  const clearChat = () => {
    setSessions([]);
    setMessages([]);
    setActiveSessionId(null);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        sessions,
        setSessions,
        activeSessionId,
        setActiveSessionId,
        isLoading,
        setIsLoading,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {

  const context = useContext(ChatContext);

  if (!context) {
    throw new Error(
      "useChat must be used inside ChatProvider"
    );
  }

  return context;
}