"use client";

import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/context/AuthContext";

import {
  registerFormSchema,
  RegisterFormData,
} from "@/schemas/authForm.schema";

import AuthDialog from "./AuthDialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  /**
   * Opens Login Dialog after successful registration.
   */
  onLoginClick: () => void;
}

export default function RegisterDialog({
  open,
  onOpenChange,
  onLoginClick,
}: RegisterDialogProps) {
  const { registerUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  /**
   * Register User
   */
  const onSubmit = async (
    data: RegisterFormData
  ) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      toast.success("Registration successful!");

      reset();

      onOpenChange(false);

      onLoginClick();
    } catch (error: unknown) {
      toast.error(
        (isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message
          : undefined) ??
          "Registration failed."
      );
    }
  };

  return (
    <AuthDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create Account"
      description="Create your account to start using the AI Voice Assistant."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* ---------------------- Name ---------------------- */}

        <div className="space-y-2">
          <Label className="text-slate-200" htmlFor="name">
            Full Name
          </Label>

          <Input
            id="name"
            placeholder="John Doe"
            className="h-12 rounded-xl border-white/15 bg-white/[0.03] px-4 text-white placeholder:text-slate-500 focus-visible:border-blue-400"
            {...register("name")}
          />

          {errors.name && (
            <p className="text-sm text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

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

        {/* ------------------ Confirm Password ------------------ */}

        <div className="space-y-2">
          <Label className="text-slate-200" htmlFor="confirmPassword">
            Confirm Password
          </Label>

          <div className="relative">
            <Input
              id="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Re-enter your password"
              className="h-12 rounded-xl border-white/15 bg-white/[0.03] px-4 pr-12 text-white placeholder:text-slate-500 focus-visible:border-blue-400"
              {...register("confirmPassword")}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-white"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="text-sm text-red-400">
              {errors.confirmPassword.message}
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
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        {/* ---------------------- Footer ---------------------- */}

        <div className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              onLoginClick();
            }}
            className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
          >
            Login
          </button>
        </div>
      </form>
    </AuthDialog>
  );
}
