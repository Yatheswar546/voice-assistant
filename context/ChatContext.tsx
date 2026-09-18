"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import type { ChatMessage } from "@/types/chat";
import type { ChatSession } from "@/types/session";
import { getSessions } from "@/services/session.service";

interface ChatContextType {
  messages: ChatMessage[];
  setMessages: React.Dispatch<
    React.SetStateAction<ChatMessage[]>
  >;

  sessions: ChatSession[];
  setSessions: React.Dispatch<
    React.SetStateAction<ChatSession[]>
  >;

  activeSessionId: string | null;
  setActiveSessionId: React.Dispatch<
    React.SetStateAction<string | null>
  >;

  activeDocumentId: string | null;
  setActiveDocumentId: React.Dispatch<
    React.SetStateAction<string | null>
  >;

  activeDocumentName: string | null;
  setActiveDocumentName: React.Dispatch<
    React.SetStateAction<string | null>
  >;

  isLoading: boolean;
  setIsLoading: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  clearChat: () => void;

  loadSessions: () => Promise<void>;
}

const ChatContext = createContext<
  ChatContextType | undefined
>(undefined);

export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error(
      "useChat must be used inside ChatProvider"
    );
  }

  return context;
}

export function ChatProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    []
  );

  const [sessions, setSessions] = useState<ChatSession[]>(
    []
  );

  const [activeSessionId, setActiveSessionId] =
    useState<string | null>(null);

  const [activeDocumentId, setActiveDocumentId] =
    useState<string | null>(null);

  const [activeDocumentName, setActiveDocumentName] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const clearChat = () => {
    setSessions([]);
    setMessages([]);
    setActiveSessionId(null);
    setActiveDocumentId(null);
    setActiveDocumentName(null);
  };

  const loadSessions = async () => {
    try {
      const sessions = await getSessions();
      setSessions(sessions);
    } catch (error) {
      // console.error(error);
    }
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

        activeDocumentId,
        setActiveDocumentId,

        activeDocumentName,
        setActiveDocumentName,

        isLoading,
        setIsLoading,

        clearChat,
        loadSessions,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}