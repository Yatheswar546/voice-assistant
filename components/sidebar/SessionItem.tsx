interface SessionItemProps {
  title: string;
  active?: boolean;
}

export default function SessionItem({
  title,
  active = false,
}: SessionItemProps) {
  return (
    <button
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