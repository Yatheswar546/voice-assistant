import MessageList from "./MessageList";
import type { ChatMessage } from "@/types/chat";

interface ChatWindowProps {
  messages: ChatMessage[];
}

export default function ChatWindow({
  messages,
}: ChatWindowProps) {
  return (
    <section className="h-full overflow-y-auto px-12 py-10">
      <MessageList messages={messages} />
    </section>
  );
}