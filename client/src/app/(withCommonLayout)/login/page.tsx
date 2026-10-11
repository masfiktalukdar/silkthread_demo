"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { loginUser, getAuthenticatedUser } from "@/services/auth";
import { TResponse } from "@/types";
import logo from "@/assets/logo/logo_navbar_taller.png";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
  FiTruck,
  FiCheckCircle,
} from "react-icons/fi";

interface LoginFormInputs {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const user = await getAuthenticatedUser();
        if (user && user.id) {
          const redirectParam = searchParams.get("redirect");
          const destination =
            redirectParam && redirectParam.startsWith("/")
              ? redirectParam
              : "/dashboard/profile";
          window.location.href = destination;
          return;
        }
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkLoggedIn();
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    setIsSubmitting(true);
    try {
      const rawInput = (data.identifier || "").trim();
      const cleanedDigits = rawInput.replace(/[\s-]/g, "");
      const isPhone = /^\+?\d{9,15}$/.test(cleanedDigits);

      const payload = {
        identifier: rawInput,
        email: isPhone ? "" : rawInput,
        phone: isPhone ? rawInput : "",
        password: data.password,
        rememberMe: data.rememberMe,
      };

      const response = (await loginUser(payload)) as TResponse;

      if (
        response?.statusCode === 200 ||
        response?.statusCode === 201 ||
        response?.data?.accessToken
      ) {
        toast.success(response.message || "Login successful! Welcome back.");
        const redirectParam = searchParams.get("redirect");
        const destination =
          redirectParam && redirectParam.startsWith("/")
            ? redirectParam
            : "/dashboard/profile";

        // Hard navigate so newly set cookies hydrate Server Components & NavBar immediately
        window.location.href = destination;
        return;
      }

      toast.error(
        response?.message || "Invalid email/phone or password. Please try again."
      );
    } catch (error: any) {
      toast.error(
        error?.message || "An unexpected error occurred during login. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-[#FFF9F5] via-white to-[#FDFDFD] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white border border-gray-200/80 shadow-xl shadow-orange-500/5 rounded-[2px] overflow-hidden p-8 sm:p-10">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4 transition-transform hover:scale-105 duration-200">
              <Image
                src={logo}
                alt="Silk Thread"
                width={150}
                height={50}
                className="mx-auto h-12 w-auto object-contain"
                priority
              />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to manage your orders, wishlist, and profile
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Identifier (Email / Phone) */}
            <div>
              <label
                htmlFor="identifier"
                className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Email Address or Phone Number
              </label>
              <div className="relative rounded-[2px]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FiMail className="w-4 h-4" />
                </div>
                <input
                  id="identifier"
                  type="text"
                  placeholder="e.g. 01325716238 or name@example.com"
                  autoComplete="username"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 border ${
                    errors.identifier
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-[#FF6C0C] focus:ring-[#FF6C0C]/20"
                  } rounded-[2px] outline-hidden focus:ring-2 transition duration-200 text-gray-900 placeholder-gray-400`}
                  {...register("identifier", {
                    required: "Email address or phone number is required",
                    validate: (val) => {
                      const trimmed = (val || "").trim();
                      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
                      const isPhone = /^\+?\d{10,15}$/.test(
                        trimmed.replace(/[\s-]/g, "")
                      );
                      if (!isEmail && !isPhone) {
                        return "Please enter a valid email or 10-14 digit phone number";
                      }
                      return true;
                    },
                  })}
                />
              </div>
              {errors.identifier && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <span>•</span> {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-wider text-gray-700"
                >
                  Password
                </label>
                <Link
                  href="/forgotpassword"
                  className="text-xs font-medium text-[#FF6C0C] hover:text-[#e55a00] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative rounded-[2px]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FiLock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50/50 border ${
                    errors.password
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-[#FF6C0C] focus:ring-[#FF6C0C]/20"
                  } rounded-[2px] outline-hidden focus:ring-2 transition duration-200 text-gray-900 placeholder-gray-400`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-hidden"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <span>•</span> {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#FF6C0C] border-gray-300 rounded-[2px] focus:ring-[#FF6C0C] accent-[#FF6C0C] cursor-pointer"
                  {...register("rememberMe")}
                />
                <span className="ml-2 text-xs text-gray-600 font-medium">
                  Remember me on this device
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-[2px] font-bold text-sm text-white uppercase tracking-wider bg-[#FF6C0C] hover:bg-[#e55a00] shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : "active:scale-[0.99]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/register"
                className="font-bold text-[#FF6C0C] hover:text-[#e55a00] hover:underline transition-colors"
              >
                Register Now
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-gray-500">
          <div className="flex flex-col items-center p-2">
            <FiShield className="w-4 h-4 text-[#FF6C0C] mb-1" />
            <span className="text-[11px] font-medium leading-tight">100% Secure</span>
          </div>
          <div className="flex flex-col items-center p-2">
            <FiTruck className="w-4 h-4 text-[#FF6C0C] mb-1" />
            <span className="text-[11px] font-medium leading-tight">Fast Delivery</span>
          </div>
          <div className="flex flex-col items-center p-2">
            <FiCheckCircle className="w-4 h-4 text-[#FF6C0C] mb-1" />
            <span className="text-[11px] font-medium leading-tight">Original Quality</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
