"use client";

import { useEffect, useState } from "react";
import { useAuthStore, type User } from "@/store/authStore";
import { isSupabaseConfigured, getSiteUrl } from "@/lib/supabase/config";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { USE_MOCK_DATA } from "./config";

export { USE_MOCK_DATA, isSupabaseConfigured };
export type { User };

function mapSupabaseUser(user: SupabaseUser | null): User | null {
  if (!user) return null;
  const metadata = user.user_metadata || {};
  return {
    id: user.id,
    name:
      metadata.full_name ||
      metadata.name ||
      user.email?.split("@")[0]?.replace(".", " ") ||
      "Traveler",
    email: user.email || "",
    avatarUrl:
      metadata.avatar_url ||
      metadata.picture ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  };
}

/**
 * Returns the current authenticated user, or null if not logged in.
 */
export async function getCurrentUser(): Promise<User | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return mapSupabaseUser(user);
    } catch {
      return null;
    }
  }

  const { isLoggedIn, user } = useAuthStore.getState();
  return isLoggedIn ? user : null;
}

/**
 * Synchronous getter for current user.
 */
export function getCurrentUserSync(): User | null {
  if (isSupabaseConfigured()) {
    const { user } = useAuthStore.getState();
    return user;
  }
  const { isLoggedIn, user } = useAuthStore.getState();
  return isLoggedIn ? user : null;
}

export async function getCurrentUserAsync(): Promise<User | null> {
  return getCurrentUser();
}

/**
 * Requires an authenticated user. Throws an error if not logged in.
 */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthenticated: User is not logged in");
  }
  return user;
}

/**
 * React hook to reactively get the current authenticated user in client components.
 * Subscribes to Supabase onAuthStateChange and keeps useAuthStore synchronized.
 */
export function useCurrentUser(): User | null {
  const mockIsLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const mockUser = useAuthStore((state) => state.user);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    const supabase = createBrowserClient();

    // Fetch initial Supabase user
    supabase.auth.getUser().then(({ data: { user: sbUser } }) => {
      const mapped = mapSupabaseUser(sbUser);
      setSupabaseUser(mapped);
      if (mapped) {
        useAuthStore.getState().login(mapped);
      } else {
        useAuthStore.getState().logout();
      }
    });

    // Listen to live auth changes (e.g. login, logout, OAuth return)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const mapped = mapSupabaseUser(session?.user ?? null);
      setSupabaseUser(mapped);
      if (mapped) {
        useAuthStore.getState().login(mapped);
      } else {
        useAuthStore.getState().logout();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!isSupabaseConfigured()) {
    return mockIsLoggedIn ? mockUser : null;
  }

  return supabaseUser ?? (mockIsLoggedIn ? mockUser : null);
}

/**
 * Check if the user is currently logged in.
 */
export function isUserLoggedIn(): boolean {
  return getCurrentUserSync() !== null;
}

/**
 * Sign in with email and password via Supabase Auth
 */
export async function signInWithEmail(email: string, password: string) {
  if (isSupabaseConfigured()) {
    const supabase = createBrowserClient();
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!result.error && result.data.user) {
      const mapped = mapSupabaseUser(result.data.user);
      if (mapped) useAuthStore.getState().login(mapped);
    }
    return result;
  }

  // Simulated / Mock fallback
  if (email.toLowerCase() === "wrong@test.com") {
    return {
      data: { user: null, session: null },
      error: { message: "Invalid login credentials", status: 400 },
    };
  }

  const mockUser: User = {
    name: email.split("@")[0].replace(".", " "),
    email,
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  };
  useAuthStore.getState().login(mockUser);
  return { data: { user: mockUser, session: {} }, error: null };
}

/**
 * Sign up with email and password via Supabase Auth.
 * Note: Email confirmation is disabled in project settings, so user is signed in immediately.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName?: string
) {
  if (isSupabaseConfigured()) {
    const supabase = createBrowserClient();
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (!result.error && result.data.user) {
      const mapped = mapSupabaseUser(result.data.user);
      if (mapped) useAuthStore.getState().login(mapped);
    }
    return result;
  }

  // Simulated / Mock fallback
  if (email.toLowerCase() === "taken@test.com") {
    return {
      data: { user: null, session: null },
      error: { message: "User already registered", status: 400 },
    };
  }

  const mockUser: User = {
    name: fullName || email.split("@")[0].replace(".", " "),
    email,
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  };
  useAuthStore.getState().login(mockUser);
  return { data: { user: mockUser, session: {} }, error: null };
}

/**
 * Sign in / Sign up with Google OAuth via Supabase Auth
 */
export async function signInWithGoogle(redirectTo: string = "/home") {
  if (isSupabaseConfigured()) {
    const supabase = createBrowserClient();
    const siteUrl = getSiteUrl();
    const callbackUrl = `${siteUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
    return await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
      },
    });
  }

  // Simulated / Mock fallback
  const mockUser: User = {
    name: "Alexandra Morris",
    email: "alexandra.morris@voyage.co",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  };
  useAuthStore.getState().login(mockUser);
  return { data: { provider: "google", url: null }, error: null };
}

/**
 * Send password reset email via Supabase Auth
 */
export async function sendPasswordResetEmail(email: string) {
  if (isSupabaseConfigured()) {
    const supabase = createBrowserClient();
    const siteUrl = getSiteUrl();
    const callbackUrl = `${siteUrl}/forgot-password?reset=true`;
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: callbackUrl,
    });
  }

  if (email.toLowerCase() === "wrong@test.com") {
    return { data: null, error: { message: "User not found", status: 404 } };
  }

  return { data: {}, error: null };
}

/**
 * Log out user from Supabase and clear local state
 */
export async function logoutUser(): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }
  useAuthStore.getState().logout();
}

/**
 * Legacy / mock helper to login user
 */
export function loginUser(userData?: Partial<User>): void {
  useAuthStore.getState().login(userData);
}

/**
 * Mock helper: toggle mock authentication state
 */
export function toggleMockAuth(): void {
  useAuthStore.getState().toggleAuth();
}
