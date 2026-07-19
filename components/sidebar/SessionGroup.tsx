import SessionItem from "./SessionItem";

interface SessionGroupProps {
  title: string;
  sessions: string[];
}

export default function SessionGroup({
  title,
  sessions,
}: SessionGroupProps) {
  return (
    <div className="space-y-2">
      <h2 className="px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {title}
      </h2>

      {sessions.map((session, index) => (
        <SessionItem
          key={session}
          title={session}
          active={index === 0 && title === "Today"}
        />
      ))}
    </div>
  );
}