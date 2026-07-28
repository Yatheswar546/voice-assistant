"use client";

import { useEffect } from "react";

import Logo from "@/components/common/Logo";
import NewSessionButton from "./NewSessionButton";
import SessionGroup from "./SessionGroup";
import { useChat } from "@/context/ChatContext";
import { getSessionMessages } from "@/services/message.service";
import { useAuth } from "@/hooks/useAuth";
import { deleteSession, renameSession } from "@/services/session.service";
import { groupSessions } from "@/utils/groupSessions";
import AuthButton from "../auth/AuthButton";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {

  const { isAuthenticated } = useAuth();

  const {
    sessions,
    setMessages,
    activeSessionId,
    setActiveSessionId,
    loadSessions
  } = useChat();

  const groupedSessions = groupSessions(sessions);

  useEffect(() => {
    if (isAuthenticated) {
      loadSessions();
    }
  }, [isAuthenticated]);

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

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);

      // Refresh the sidebar
      await loadSessions();

      // If the deleted chat was currently open,
      // clear the chat window.
      if (activeSessionId === sessionId) {
        setMessages([]);
        setActiveSessionId(null);
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  const handleRenameSession = async (
    sessionId: string,
    newTitle: string
  ) => {
    try {
      await renameSession(sessionId, newTitle);

      await loadSessions();

    } catch (error) {
      console.error("Failed to rename session:", error);
    }
  };

  return (
    <>

      <aside className="m-4 hidden h-[calc(100vh-2rem)] w-80 shrink-0 flex-col rounded-3xl border border-white/10 bg-[#111217] p-6 lg:flex">

        {/* Logo */}
        <Logo />

        {/* Button */}
        <div className="mt-8">
          <NewSessionButton />
        </div>

        {/* Session List */}
        <div className="mt-10 flex-1 overflow-x-hidden overflow-y-auto space-y-8">

          {!isAuthenticated ? (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-400">
              Login to view chat history
            </div>
          ) : (
            <>
              {groupedSessions.map((group) => (
                <SessionGroup
                  key={group.title}
                  title={group.title}
                  sessions={group.sessions}
                  activeSessionId={activeSessionId}
                  onSessionClick={handleSessionClick}
                  onDelete={handleDeleteSession}
                  onRename={handleRenameSession}
                />
              ))
              }
            </>
          )}

        </div>

      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
        fixed
        top-0
        left-0
        z-50
        h-screen
        w-80
        bg-[#111217]
        border-r
        border-white/10
        p-6
        transform
        transition-transform
        duration-300
        lg:hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >

        {/* Logo */}
        <Logo />

        {/* Button */}
        <div className="mt-8">
          <NewSessionButton />
        </div>

        {/* Session List */}
        <div className="mt-10 flex flex-1 flex-col">

          <div className="flex-1 overflow-y-auto space-y-8">

            {!isAuthenticated ? (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-400">
                Login to view chat history
              </div>
            ) : (
              <>
                {groupedSessions.map((group) => (
                  <SessionGroup
                    key={group.title}
                    title={group.title}
                    sessions={group.sessions}
                    activeSessionId={activeSessionId}
                    onSessionClick={handleSessionClick}
                    onDelete={handleDeleteSession}
                    onRename={handleRenameSession}
                  />
                ))}
              </>
            )}

          </div>

          {/* Mobile Login / Profile */}
          <div className="mt-auto border-t border-white/10 pt-5">
            <AuthButton mobile />
          </div>

        </div>

      </aside>

    </>
  );
}
