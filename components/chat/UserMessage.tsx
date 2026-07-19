interface UserMessageProps {
  message: string;
}

export default function UserMessage({
  message,
}: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-xl rounded-3xl bg-[#202127] px-6 py-4 text-lg text-white">
        {message}
      </div>
    </div>
  );
}