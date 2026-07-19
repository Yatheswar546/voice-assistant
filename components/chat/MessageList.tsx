import AssistantMessage from "./AssistantMessage";
import UserMessage from "./UserMessage";

export default function MessageList() {
  return (
    <div className="space-y-12">
      <UserMessage message="What is the weather like tomorrow?" />

      <AssistantMessage
        category="Weather"
        message="Tomorrow will be sunny with a high of 23°C (73°F). A light breeze from the west is expected."
      />

      <UserMessage message="Can you set a reminder for 9 AM?" />

      <AssistantMessage
        category="Reminder"
        message="Okay, setting a reminder for tomorrow at 9 AM."
      />
    </div>
  );
}