import AssistantHeader from "@/components/assistant/AssistantHeader";
import ChatWindow from "@/components/chat/ChatWindow";
import VoiceInput from "@/components/voice/VoiceInput";

export default function MainContent() {
  return (
    <main className="flex flex-1 flex-col">
      <AssistantHeader />

      <div className="flex-1 overflow-hidden">
        <ChatWindow />
      </div>

      <VoiceInput />
    </main>
  );
}