import MessageList from "./MessageList";

export default function ChatWindow() {
  return (
    <section className="h-full overflow-y-auto px-12 py-10">
      <MessageList />
    </section>
  );
}