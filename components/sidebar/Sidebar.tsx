"use client";

import { useEffect, useState } from "react";

import Logo from "@/components/common/Logo";
import NewSessionButton from "./NewSessionButton";
import SessionGroup from "./SessionGroup";
import { getSessions } from "@/services/session.service";
import { SessionGroup as SessionGroupType } from "@/types/session";

export default function Sidebar() {

  const [groups, setGroups] = useState<SessionGroupType[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>();

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      const sessions = await getSessions();

      const grouped: SessionGroupType[] = [
        {
          title: "All Chats",
          sessions,
        },
      ];

      setGroups(grouped);
    } catch (error) {
      console.error(error);
    }
  }

  function handleSessionClick(sessionId: string) {
    setActiveSessionId(sessionId);

    console.log("Selected Session:", sessionId);

    // Next step:
    // Fetch messages for this session
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
        {groups.map((group) => (
          <SessionGroup
            key={group.title}
            title={group.title}
            sessions={group.sessions}
            activeSessionId={activeSessionId}
            onSessionClick={handleSessionClick}
          />
        ))}
      </div>

    </aside>
  );
}
