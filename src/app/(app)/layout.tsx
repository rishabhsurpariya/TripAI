"use client";

import { useEffect, useSyncExternalStore, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const emptySubscribe = () => () => {};

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, toggleAuth } = useAuthStore();
  const hasMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    if (hasMounted && !isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [hasMounted, isLoggedIn, router, pathname]);

  if (!hasMounted) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-neutral-500">
        Loading app...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
        <p className="text-sm text-neutral-600">
          Redirecting to /login (Protected route)...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Dev mock auth state bar */}
      <div className="bg-[#f2ede7] border-b border-[#d3c4b9]/50 px-4 py-1.5 text-xs flex items-center justify-between text-[#54381d]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>
            Mock Auth: <strong>Logged In</strong> (Elena Rostova)
          </span>
        </div>
        <button
          onClick={toggleAuth}
          className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#6e4f32] text-white hover:bg-[#54381d] transition-colors"
        >
          Toggle to Logged Out (Test Redirect)
        </button>
      </div>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}

export default function AppProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-8 text-neutral-500">
          Loading layout...
        </div>
      }
    >
      <AuthGuard>{children}</AuthGuard>
    </Suspense>
  );
}
