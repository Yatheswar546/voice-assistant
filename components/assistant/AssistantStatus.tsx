interface AssistantStatusProps {
  status?: "idle" | "listening" | "thinking" | "speaking";
}

const statusConfig = {
  idle: {
    label: "Ready",
    dot: "bg-gray-400",
    border: "border-gray-600",
    text: "text-gray-300",
    animation: "",
  },

  listening: {
    label: "Listening",
    dot: "bg-green-400 animate-pulse",
    border: "border-green-500/40",
    text: "text-green-300",
    animation: "",
  },

  thinking: {
    label: "Thinking",
    dot: "bg-yellow-400 animate-ping",
    border: "border-yellow-500/40",
    text: "text-yellow-300",
    animation: "",
  },

  speaking: {
    label: "Speaking",
    dot: "bg-blue-400 animate-pulse",
    border: "border-blue-500/40",
    text: "text-blue-300",
    animation: "",
  },
};

export default function AssistantStatus({
  status = "idle",
}: AssistantStatusProps) {
  const current = statusConfig[status];

  return (
    <div
      className={`flex items-center gap-3 rounded-full border px-4 py-2 backdrop-blur-sm ${current.border}`}
    >
      <span
        className={`h-3 w-3 rounded-full ${current.dot} ${current.animation}`}
      />

      <span
        className={`text-sm font-medium tracking-wide ${current.text}`}
      >
        {current.label}
      </span>
    </div>
  );
}