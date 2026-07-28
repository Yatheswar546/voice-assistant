interface SessionItemProps {
  id: string;
  title: string;
  active?: boolean;
  onClick: (id: string) => void;
}

export default function SessionItem({
  id,
  title,
  active = false,
  onClick,
}: SessionItemProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full rounded-xl px-4 py-3 text-left transition-all ${
        active
          ? "bg-blue-500 text-white"
          : "text-gray-300 hover:bg-white/5"
      }`}
    >
      {title}
    </button>
  );
}