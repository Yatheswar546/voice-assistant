"use client";

import { Plus } from "lucide-react";
import { useRef } from "react";

import { useAuth } from "@/hooks/useAuth";

interface FileUploadButtonProps {
  isLoading: boolean;
  onUploadStatusChange: (
    status: "uploading" | "uploaded" | "error" | null,
    fileName?: string
  ) => void;
  onDocumentUploaded: (
    documentId: string,
    fileName: string
  ) => void;
}

export default function FileUploadButton({
  isLoading,
  onUploadStatusChange,
  onDocumentUploaded,
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    // Guests are not allowed to upload documents.
    if (!isAuthenticated) {
      window.alert("Please login to upload documents.");
      return;
    }

    if (isLoading) return;

    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      window.alert(
        "The file size should be a maximum of 5MB."
      );
      event.target.value = "";
      return;
    }

    onUploadStatusChange("uploading", file.name);

    try {
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
        onUploadStatusChange("error", file.name);
        return;
      }

      const documentId = data.document?.id;

      if (!documentId) {
        console.error(
          "Upload succeeded but document ID was not returned."
        );

        onUploadStatusChange("error", file.name);
        return;
      }

      console.log("File uploaded successfully:", data);
      console.log("Active document ID:", documentId);

      onUploadStatusChange("uploaded", file.name);

      // Pass the uploaded document ID to the parent component.
      onDocumentUploaded(String(documentId), file.name);
    } catch (error) {
      console.error("File upload error:", error);
      onUploadStatusChange("error", file.name);
    } finally {
      // Reset the input so the same file can be selected again.
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