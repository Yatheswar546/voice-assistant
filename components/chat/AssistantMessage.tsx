import GlowOrb from "../common/GlowOrb";
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
    <div className="flex items-start gap-5">
      <GlowOrb />

      <div className="space-y-3">
        <CategoryBadge label={category} />

        <p className="max-w-2xl text-xl leading-8 text-white">
          {message}
        </p>
      </div>
    </div>
  );
}