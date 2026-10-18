import { useAuthStore, type User } from "@/store/authStore";
import { USE_MOCK_DATA } from "./config";

export { USE_MOCK_DATA };
export type { User };

/**
 * Returns the current authenticated user, or null if not logged in.
 * In mock mode, returns the user from useAuthStore if isLoggedIn is true.
 */
export function getCurrentUser(): User | null {
  if (USE_MOCK_DATA) {
    const { isLoggedIn, user } = useAuthStore.getState();
    return isLoggedIn ? user : null;
  }
  return null;
}

/**
 * Async version of getCurrentUser for future Supabase session checks.
 */
export async function getCurrentUserAsync(): Promise<User | null> {
  return getCurrentUser();
}

/**
 * Requires an authenticated user. Throws an error if not logged in.
 */
export function requireUser(): User {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("Unauthenticated: User is not logged in");
  }
  return user;
}

/**
 * React hook to reactively get the current authenticated user in client components.
 */
export function useCurrentUser(): User | null {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);
  if (!USE_MOCK_DATA) return null;
  return isLoggedIn ? user : null;
}

/**
 * Check if the user is currently logged in.
 */
export function isUserLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

/**
 * Mock helper: login with optional custom user info
 */
export function loginUser(userData?: Partial<User>): void {
  if (USE_MOCK_DATA) {
    useAuthStore.getState().login(userData);
  }
}

/**
 * Mock helper: log out the current user
 */
export function logoutUser(): void {
  if (USE_MOCK_DATA) {
    useAuthStore.getState().logout();
  }
}

/**
 * Mock helper: toggle mock authentication state
 */
export function toggleMockAuth(): void {
  if (USE_MOCK_DATA) {
    useAuthStore.getState().toggleAuth();
  }
}
