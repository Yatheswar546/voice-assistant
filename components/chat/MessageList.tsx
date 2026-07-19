import AssistantMessage from "./AssistantMessage";
import UserMessage from "./UserMessage";
import type { ChatMessage } from "@/types/chat";

interface MessageListProps {
  messages: ChatMessage[];
}

export default function MessageList({
  messages,
}: MessageListProps) {
  return (
    <div className="space-y-12">
      {messages.map((msg, index) =>
        msg.role === "user" ? (
          <UserMessage
            key={index}
            message={msg.message}
          />
        ) : (
          <AssistantMessage
            key={index}
            category={msg.category ?? ""}
            message={msg.message}
          />
        )
      )}
    </div>
  );
}