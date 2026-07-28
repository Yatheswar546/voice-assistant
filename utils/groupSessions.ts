import { ChatSession, SessionGroup } from "@/types/session";

export function groupSessions(
  sessions: ChatSession[]
): SessionGroup[] {

  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const previous7Days = new Date(today);
  previous7Days.setDate(today.getDate() - 7);

  const groups: SessionGroup[] = [];

  const todaySessions = sessions.filter((session) => {
    return new Date(session.updatedAt) >= today;
  });

  const yesterdaySessions = sessions.filter((session) => {
    const date = new Date(session.updatedAt);

    return date >= yesterday && date < today;
  });

  const previous7DaySessions = sessions.filter((session) => {
    const date = new Date(session.updatedAt);

    return (
      date >= previous7Days &&
      date < yesterday
    );
  });

  const olderSessions = sessions.filter((session) => {
    return new Date(session.updatedAt) < previous7Days;
  });

  if (todaySessions.length) {
    groups.push({
      title: "Today",
      sessions: todaySessions,
    });
  }

  if (yesterdaySessions.length) {
    groups.push({
      title: "Yesterday",
      sessions: yesterdaySessions,
    });
  }

  if (previous7DaySessions.length) {
    groups.push({
      title: "Previous 7 Days",
      sessions: previous7DaySessions,
    });
  }

  if (olderSessions.length) {
    groups.push({
      title: "Older",
      sessions: olderSessions,
    });
  }

  return groups;
}