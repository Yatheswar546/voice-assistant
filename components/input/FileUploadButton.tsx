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

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      console.log("Selected file:", file);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("Upload response:", data);

      if (!response.ok) {
        console.error("Upload failed:", data);
        return;
      }

      console.log("File uploaded successfully:", data);
    } catch (error) {
      console.error("File upload error:", error);
    } finally {
      event.target.value = "";
    }
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