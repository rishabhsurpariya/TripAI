import { create } from "zustand";

export interface User {
  id?: string;
  name: string;
  email: string;
  avatarUrl: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData?: Partial<User>) => void;
  logout: () => void;
  toggleAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Default to false when not logged in
  isLoggedIn: false,
  user: null,
  login: (userData?: Partial<User>) =>
    set({
      isLoggedIn: true,
      user: {
        name: userData?.name || "Elena Rostova",
        email: userData?.email || "elena@tripai.travel",
        avatarUrl:
          userData?.avatarUrl ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      },
    }),
  logout: () => set({ isLoggedIn: false, user: null }),
  toggleAuth: () =>
    set((state) => ({
      isLoggedIn: !state.isLoggedIn,
      user: !state.isLoggedIn
        ? {
            name: "Elena Rostova",
            email: "elena@tripai.travel",
            avatarUrl:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          }
        : null,
    })),
}));
