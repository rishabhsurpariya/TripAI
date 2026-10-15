"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const { isLoggedIn, login, logout } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/home";

  const handleLogin = () => {
    login();
    router.push(redirectUrl);
  };

  return (
    <div className="max-w-md w-full bg-white border border-[#d3c4b9]/50 rounded-2xl p-8 shadow-sm space-y-6 text-center">
      <div className="inline-block px-3 py-1 rounded-full bg-[#ffd9b7] text-[#54381d] text-xs font-semibold">
        Public Route: /login
      </div>
      <h1 className="text-3xl font-serif font-bold text-[#54381d]">Login</h1>
      <p className="text-sm text-[#4f453c]">
        Foundation placeholder for TripAi login.
      </p>

      <div className="p-4 rounded-xl bg-[#f8f3ed] border border-[#d3c4b9]/40 text-xs text-left space-y-2">
        <div>
          Current Auth Status:{" "}
          <strong className={isLoggedIn ? "text-emerald-700" : "text-amber-700"}>
            {isLoggedIn ? "Logged In" : "Logged Out"}
          </strong>
        </div>
        {redirectUrl !== "/home" && (
          <div className="text-[11px] text-[#81756b]">
            Redirect target: {redirectUrl}
          </div>
        )}
      </div>

      <div className="flex gap-2 justify-center">
        {!isLoggedIn ? (
          <button
            onClick={handleLogin}
            className="px-4 py-2 rounded-full bg-[#6e4f32] text-white hover:bg-[#54381d] text-xs font-semibold"
          >
            Simulate Login & Enter App
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={logout}
              className="px-4 py-2 rounded-full bg-[#ba1a1a] text-white text-xs font-semibold"
            >
              Log Out
            </button>
            <button
              onClick={() => router.push(redirectUrl)}
              className="px-4 py-2 rounded-full bg-[#6e4f32] text-white text-xs font-semibold"
            >
              Go to App ({redirectUrl})
            </button>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-[#d3c4b9]/40 flex gap-4 justify-center text-xs text-[#6e4f32]">
        <Link href="/signup" className="hover:underline">
          Sign Up
        </Link>
        <span>&bull;</span>
        <Link href="/forgot-password" className="hover:underline">
          Forgot Password
        </Link>
        <span>&bull;</span>
        <Link href="/" className="hover:underline">
          Landing Page
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#fef9f2] text-[#1d1b18]">
      <Suspense
        fallback={
          <div className="text-sm text-neutral-500">Loading login...</div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
