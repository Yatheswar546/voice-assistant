import Sidebar from "@/components/sidebar/Sidebar";
import MainContent from "@/components/layout/MainContent";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-[#0B0B0F] text-white">
      <Sidebar />
      <MainContent />
    </div>
  );
}