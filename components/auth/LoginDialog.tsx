"use client";

import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/context/AuthContext";

import { useRouter } from "next/navigation";

import {
  loginFormSchema,
  LoginFormData,
} from "@/schemas/authForm.schema";

import AuthDialog from "./AuthDialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  /**
   * Opens Register Dialog
   */
  onRegisterClick: () => void;
}

export default function LoginDialog({
  open,
  onOpenChange,
  onRegisterClick,
}: LoginDialogProps) {

  const router = useRouter();

  const { loginUser } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * Login User
   */
  const onSubmit = async (
    data: LoginFormData
  ) => {
    try {
      await loginUser(data);

      toast.success("Login successful!");

      reset();

      onOpenChange(false);

      router.push("/assistant");
      
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Login failed."
      );
    }
  };

  return (
    <AuthDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Welcome Back"
      description="Login to continue using the AI Voice Assistant."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* ---------------------- Email ---------------------- */}

        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

                {/* ---------------------- Password ---------------------- */}

        <div className="space-y-2">
          <Label htmlFor="password">
            Password
          </Label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* ---------------------- Submit ---------------------- */}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            "Login"
          )}
        </Button>

        {/* ---------------------- Footer ---------------------- */}

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              onRegisterClick();
            }}
            className="font-medium text-primary hover:underline"
          >
            Register
          </button>
        </div>
      </form>
    </AuthDialog>
  );
}