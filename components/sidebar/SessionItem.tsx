"use client"

import { useEffect, useRef, useState } from "react";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SessionItemProps {
  id: string;
  title: string;
  active?: boolean;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (
    id: string,
    newTitle: string
  ) => Promise<void>;
}


export default function SessionItem({
  id,
  title,
  active = false,
  onClick,
  onDelete,
  onRename,
}: SessionItemProps) {

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [editedTitle, setEditedTitle] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  const handleRename = async () => {
    const trimmedTitle = editedTitle.trim();

    if (!trimmedTitle) {
      setEditedTitle(title);
      setIsEditing(false);
      return;
    }

    if (trimmedTitle === title) {
      setIsEditing(false);
      return;
    }

    try {
      await onRename(id, trimmedTitle);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to rename session:", error);
      setEditedTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <>
      <div
        className={`group flex items-center justify-between rounded-xl transition-all ${active
          ? "bg-blue-500 text-white"
          : "text-gray-300 hover:bg-white/5"
          }`}
      >
        {/* Session Button */}
        <div className="min-w-0 flex-1 px-4 py-3">

          {isEditing ? (
            <input
              ref={inputRef}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRename();
                }

                if (e.key === "Escape") {
                  setEditedTitle(title);
                  setIsEditing(false);
                }
              }}
              className="w-full rounded bg-transparent outline-none"
            />
          ) : (
            <button
              onClick={() => onClick(id)}
              className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-left"
            >
              {title}
            </button>
          )}

        </div>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="mr-2 shrink-0 rounded-md p-2 opacity-0 transition-opacity hover:bg-white/10 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">

            <DropdownMenuItem
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>

            <DropdownMenuItem
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Delete Dialog */}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>

          <AlertDialogHeader>

            <AlertDialogTitle>
              Delete Chat?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this chat
              and all of its messages.
            </AlertDialogDescription>

          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => onDelete(id)}
            >
              Delete
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}