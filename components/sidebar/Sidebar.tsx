import Logo from "@/components/common/Logo";
import NewSessionButton from "./NewSessionButton";
import SessionGroup from "./SessionGroup";

const todaySessions = [
  "Planning my weekend",
  "Weather update",
  "Reminder: Dentist appt",
  "Movie ideas",
];

const earlierSessions = [
  "Python code debug",
];

export default function Sidebar() {
  return (
    <aside className="m-4 flex h-[calc(100vh-2rem)] w-80 flex-col rounded-3xl border border-white/10 bg-[#111217] p-6">
      {/* Logo */}
      <Logo />

      {/* Button */}
      <div className="mt-8">
        <NewSessionButton />
      </div>

      {/* Session List */}
      <div className="mt-10 flex-1 space-y-8 overflow-y-auto">
        <SessionGroup title="Today" sessions={todaySessions} />

        <SessionGroup title="Earlier" sessions={earlierSessions} />
      </div>
    </aside>
  );
}