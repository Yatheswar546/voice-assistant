"use client";

import { useState } from "react";

import Sidebar from "@/components/sidebar/Sidebar";
import MainContent from "@/components/layout/MainContent";
import { ChatProvider } from "@/context/ChatContext";

export default function AppLayout() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ChatProvider>
      <div className="flex min-h-screen bg-[#0B0B0F] text-white">
        
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <MainContent 
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

      </div>
    </ChatProvider>
  );
}
