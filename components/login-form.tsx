"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <form className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex flex-col gap-3 text-center mb-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-sm">
          Enter your credentials to access your dashboard
        </p>
      </div>

      {/* Fields */}
      <div className="grid gap-6">
        {/* Email Field */}
        <div className="grid gap-2.5">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2  w-5 h-5 group-focus-within:text-primary-color transition-colors duration-200 z-10 pointer-events-none" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              className="pl-12"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="grid gap-2.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="#"
              className="text-sm text-primary-color hover:text-primary-color/80 font-medium transition-colors duration-200 hover:underline underline-offset-2"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2  w-5 h-5 group-focus-within:text-primary-color transition-colors duration-200 z-10 pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter your password"
              className="pl-12 pr-12"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-4 top-1/2 -translate-y-1/2  hover:text-primary-color transition-colors duration-200 p-1 rounded-md hover:bg-gray-100"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <Button type="submit" className="w-full group mt-2">
          Sign In
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </Button>
      </div>
    </form>
  );
}
