import { Plus } from "lucide-react";
import { useRef } from "react";

interface FileUploadButtonProps {
  isLoading: boolean;
}

export default function FileUploadButton({
  isLoading,
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    console.log("Selected file:", file);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        aria-label="Upload file"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={24} />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp"
        className="hidden"
      />
    </>
  );
}