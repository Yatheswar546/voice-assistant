"use client";

import { useState } from "react";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";

import LoginDialog from "./LoginDialog";
import RegisterDialog from "./RegisterDialog";

import { Button } from "@/components/ui/button";

import { useChat } from "@/context/ChatContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AuthButton() {
  const {
    user,
    isAuthenticated,
    logoutUser,
  } = useAuth();

  const { clearChat } = useChat();

  const [loginOpen, setLoginOpen] =
    useState(false);

  const [registerOpen, setRegisterOpen] =
    useState(false);

  /**
   * Logout User
   */
  const handleLogout = async () => {
    try {
      await logoutUser();

      clearChat();

      toast.success("Logged out successfully.");
    } catch {
      toast.error("Unable to logout.");
    }
  };

  /**
   * Guest View
   */
  if (!isAuthenticated) {
    return (
      <>
        <Button
          onClick={() => setLoginOpen(true)}
          variant="outline"
          className="h-11 rounded-full border-blue-500 px-6 text-base text-white hover:border-blue-400 hover:bg-blue-500/10"
        >
          Login
        </Button>

        <LoginDialog
          open={loginOpen}
          onOpenChange={setLoginOpen}
          onRegisterClick={() => {
            setLoginOpen(false);
            setRegisterOpen(true);
          }}
        />

        <RegisterDialog
          open={registerOpen}
          onOpenChange={setRegisterOpen}
          onLoginClick={() => {
            setRegisterOpen(false);
            setLoginOpen(true);
          }}
        />
      </>
    );
  }

  /**
   * Authenticated View
   */
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-11 gap-2 rounded-full border-white/15 bg-transparent px-5 text-base text-white hover:border-blue-400 hover:bg-white/5"
          >
            <User className="h-4 w-4" />

            <span className="max-w-36 truncate">
              {user?.name}
            </span>
          </Button>
        </DropdownMenuTrigger>

                <DropdownMenuContent
          align="end"
          className="w-64 border border-white/15 bg-[#111217] p-2 text-white shadow-[0_16px_50px_rgba(0,0,0,0.4)]"
        >
          <div className="px-2 py-2">
            <p className="font-medium">
              {user?.name}
            </p>

            <p className="truncate text-sm text-slate-400">
              {user?.email}
            </p>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Keep dialogs mounted for smooth switching */}
      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onRegisterClick={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />

      <RegisterDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onLoginClick={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />
    </>
  );
}
