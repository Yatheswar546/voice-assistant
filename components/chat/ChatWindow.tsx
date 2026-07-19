import MessageList from "./MessageList";
import type { ChatMessage } from "@/types/chat";
import { useEffect, useRef } from "react";

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export default function ChatWindow({
  messages,
  isLoading,
}: ChatWindowProps) {

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  return (
    <section className="h-full overflow-y-auto px-12 py-10">
      <MessageList
        messages={messages}
        isLoading={isLoading}
      />

      <div ref={bottomRef} />
    </section>
  );
}