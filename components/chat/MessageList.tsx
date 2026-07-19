import AssistantMessage from "./AssistantMessage";
import UserMessage from "./UserMessage";
import type { ChatMessage } from "@/types/chat";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export default function MessageList({
  messages,
  isLoading,
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

      {/* Loading Message */}
      {isLoading && (
        <AssistantMessage
          category=""
          message="Thinking..."
        />
      )}
    </div>
  );
}