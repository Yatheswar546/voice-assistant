interface AssistantStatusProps {
  status?: "idle" | "listening" | "thinking" | "speaking";
}

export default function AssistantStatus({
  status = "idle",
}: AssistantStatusProps) {
  const statusMap = {
    idle: "listening (idle)",
    listening: "Listening...",
    thinking: "Thinking...",
    speaking: "Speaking...",
  };

  return (
    <span className="text-2xl font-light text-gray-400">
      {statusMap[status]}
    </span>
  );
}