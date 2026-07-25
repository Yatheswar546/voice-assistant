"use client";

import { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description: string;

  children: ReactNode;
}

export default function AuthDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 bg-[#111217] p-7 sm:max-w-[28rem] sm:p-8">
        <DialogHeader className="space-y-3 pr-8">
          <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-700 text-xl font-semibold text-white shadow-[0_0_24px_rgba(47,125,246,0.4)]">
            A
          </div>
          <DialogTitle className="text-3xl font-semibold tracking-tight text-white">
            {title}
          </DialogTitle>

          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
