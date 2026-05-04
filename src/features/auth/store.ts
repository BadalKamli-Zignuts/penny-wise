import type { User } from "firebase/auth";
import { create } from "zustand";

type AuthState = {
  user: User | null;
  ready: boolean;
  setUser: (user: User | null) => void;
  setReady: (ready: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  ready: false,
  setUser: (user) => set({ user, ready: true }),
  setReady: (ready) => set({ ready }),
}));
