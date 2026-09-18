"use client";

import { Check, FileText, Loader2, XCircle } from "lucide-react";
import { useState } from "react";

import VoiceButton from "./VoiceButton";
import FileUploadButton from "./FileUploadButton";

type UploadStatus = "uploading" | "uploaded" | "error" | null;

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
}

export default function ChatInput({
  input,
  onInputChange,
  onSend,
  isLoading,
  isListening,
  startListening,
  stopListening,
}: ChatInputProps) {
  const [uploadStatus, setUploadStatus] =
    useState<UploadStatus>(null);

  const [uploadedFileName, setUploadedFileName] =
    useState<string>("");

  const handleUploadStatusChange = (
    status: UploadStatus,
    fileName?: string
  ) => {
    setUploadStatus(status);

    if (fileName) {
      setUploadedFileName(fileName);
    }
  };

  return (
    <footer className="border-t border-white/10 px-4 py-2 lg:px-12 lg:py-4">

      {/* Uploaded File Status */}
      {uploadStatus && uploadedFileName && (
        <div className="mb-3 flex items-center">
          <div className="flex max-w-full items-center gap-2 rounded-lg border border-white/10 bg-[#16171D] px-3 py-2 text-sm text-gray-300">

            <FileText
              size={17}
              className="shrink-0 text-gray-400"
            />

            <span className="max-w-[250px] truncate lg:max-w-[500px]">
              {uploadedFileName}
            </span>

            {uploadStatus === "uploading" && (
              <>
                <Loader2
                  size={16}
                  className="shrink-0 animate-spin text-gray-400"
                />

                <span className="text-gray-400">
                  Uploading...
                </span>
              </>
            )}

            {uploadStatus === "uploaded" && (
              <>
                <Check
                  size={16}
                  className="shrink-0 text-green-400"
                />

                <span className="text-green-400">
                  Uploaded
                </span>
              </>
            )}

            {uploadStatus === "error" && (
              <>
                <XCircle
                  size={16}
                  className="shrink-0 text-red-400"
                />

                <span className="text-red-400">
                  Upload failed
                </span>
              </>
            )}

          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#16171D] px-4 py-2 shadow-[0_16px_45px_rgba(0,0,0,0.22)] lg:gap-4 lg:px-8 lg:py-3">

        <FileUploadButton
          isLoading={isLoading}
          onUploadStatusChange={handleUploadStatusChange}
        />

        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading) {
              onSend();
            }
          }}
          placeholder="Type, or press the mic to speak..."
          className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none lg:text-lg"
          disabled={isLoading}
        />

        <VoiceButton
          isLoading={isLoading}
          isListening={isListening}
          startListening={startListening}
          stopListening={stopListening}
        />

      </div>
    </footer>
  );
}