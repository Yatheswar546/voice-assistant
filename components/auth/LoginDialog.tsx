"use client";

import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { isAxiosError } from "axios";
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
      
    } catch (error: unknown) {
      toast.error(
        (isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message
          : undefined) ??
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
          <Label className="text-slate-200" htmlFor="email">
            Email Address
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            className="h-12 rounded-xl border-white/15 bg-white/[0.03] px-4 text-white placeholder:text-slate-500 focus-visible:border-blue-400"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-sm text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

                {/* ---------------------- Password ---------------------- */}

        <div className="space-y-2">
          <Label className="text-slate-200" htmlFor="password">
            Password
          </Label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="h-12 rounded-xl border-white/15 bg-white/[0.03] px-4 pr-12 text-white placeholder:text-slate-500 focus-visible:border-blue-400"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-white"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-sm text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* ---------------------- Submit ---------------------- */}

        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-[#2f7df6] text-base text-white shadow-[0_10px_25px_rgba(47,125,246,0.25)] hover:bg-[#3e8aff]"
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

        <div className="text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              onRegisterClick();
            }}
            className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
          >
            Register
          </button>
        </div>
      </form>
    </AuthDialog>
  );
}
