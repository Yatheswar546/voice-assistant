import type { ReactNode } from "react";
import AssistantAvatar from "./AssistantAvatar";

interface AssistantBubbleProps {
  children: ReactNode;
}

export default function AssistantBubble({
  children,
}: AssistantBubbleProps) {
  return (
    <div className="flex items-start gap-5">
      <AssistantAvatar />

      <div className="max-w-4xl rounded-2xl rounded-tl-sm border border-white/10 bg-[#16171D] px-6 py-5">
        {children}
      </div>
    </div>
  );
}