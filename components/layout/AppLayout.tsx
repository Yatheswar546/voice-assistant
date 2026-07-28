import Sidebar from "@/components/sidebar/Sidebar";
import MainContent from "@/components/layout/MainContent";
import { ChatProvider } from "@/context/ChatContext";

export default function AppLayout() {
  return (
    <ChatProvider>
      <div className="flex min-h-screen bg-[#0B0B0F] text-white">
        <Sidebar />
        <MainContent />
      </div>
    </ChatProvider>
  );
}
