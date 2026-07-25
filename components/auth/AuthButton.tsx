"use client";

import { useState } from "react";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";

import LoginDialog from "./LoginDialog";
import RegisterDialog from "./RegisterDialog";

import { Button } from "@/components/ui/button";

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
            className="gap-2"
          >
            <User className="h-4 w-4" />

            <span className="max-w-36 truncate">
              {user?.name}
            </span>
          </Button>
        </DropdownMenuTrigger>

                <DropdownMenuContent
          align="end"
          className="w-56"
        >
          <div className="px-2 py-2">
            <p className="font-medium">
              {user?.name}
            </p>

            <p className="text-sm text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-600 focus:text-red-600"
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