import AssistantBubble from "../assistant/AssistantBubble";
import TypingDots from "./TypingDots";

export default function LoadingMessage() {
  return (
    <AssistantBubble>
      <TypingDots />
    </AssistantBubble>
  );
}