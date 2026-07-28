"use client";

import { useEffect } from "react";

import Logo from "@/components/common/Logo";
import NewSessionButton from "./NewSessionButton";
import SessionGroup from "./SessionGroup";
import { getSessions } from "@/services/session.service";
import { useChat } from "@/context/ChatContext";
import { getSessionMessages } from "@/services/message.service";
import { useAuth } from "@/hooks/useAuth";

export default function Sidebar() {

  const { isAuthenticated } = useAuth();

  const {
    sessions,
    setSessions,
    messages,
    setMessages,
    activeSessionId,
    setActiveSessionId,
  } = useChat();

  useEffect(() => {
    if(isAuthenticated) {
      loadSessions();
    }
  }, [isAuthenticated]);

  async function loadSessions() {
    try {
      const sessions = await getSessions();

      setSessions(sessions);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSessionClick(sessionId: string) {
    try {
      setActiveSessionId(sessionId);

      const messages = await getSessionMessages(sessionId);

      setMessages(messages);

      console.log("Loaded Session:", sessionId);

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <aside className="m-4 hidden h-[calc(100vh-2rem)] w-80 shrink-0 flex-col rounded-3xl border border-white/10 bg-[#111217] p-6 lg:flex">

      {/* Logo */}
      <Logo />

      {/* Button */}
      <div className="mt-8">
        <NewSessionButton />
      </div>

      {/* Session List */}
      <div className="mt-10 flex-1 space-y-8 overflow-y-auto">

        {!isAuthenticated ? (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-400">
            Login to view chat history
          </div>
        ) : (
          <SessionGroup
            title="All Chats"
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSessionClick={handleSessionClick}
          />
        )}

      </div>

    </aside>
  );
}
