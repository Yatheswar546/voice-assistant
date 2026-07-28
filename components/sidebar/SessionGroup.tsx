import SessionItem from "./SessionItem";
import { ChatSession } from "@/types/session";

interface SessionGroupProps {
  title: string;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSessionClick: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function SessionGroup({
  title,
  sessions,
  activeSessionId,
  onSessionClick,
  onDelete,
}: SessionGroupProps) {
  return (
    <div className="space-y-2">
      <h2 className="px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {title}
      </h2>

      {sessions.map((session) => (
        <SessionItem
          id={session._id}
          key={session._id}
          title={session.title}
          active={activeSessionId === session._id}
          onClick={onSessionClick}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}