import AssistantBubble from "../assistant/AssistantBubble";
import CategoryBadge from "./CategoryBadge";

interface AssistantMessageProps {
  category: string;
  message: string;
}

export default function AssistantMessage({
  category,
  message,
}: AssistantMessageProps) {
  return (
    <AssistantBubble>
      {category && (
        <CategoryBadge label={category} />
      )}

      <p className="mt-3 whitespace-pre-wrap text-lg leading-8 text-white">
        {message}
      </p>
    </AssistantBubble>
  );
}