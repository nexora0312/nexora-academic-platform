import { create } from "zustand";
import type { AuthUser } from "../features/auth/types/auth.types";

export type AuthDisplayUser = AuthUser;

type AuthStore = {
  currentUser: AuthUser | null;
  isSignInOpen: boolean;
  isSigningOut: boolean;
  setCurrentUser: (user: AuthUser | null) => void;
  setSignInOpen: (isOpen: boolean) => void;
  setSigningOut: (isSigningOut: boolean) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  currentUser: null,
  isSignInOpen: false,
  isSigningOut: false,
  setCurrentUser: (currentUser) => set({ currentUser }),
  setSignInOpen: (isSignInOpen) => set({ isSignInOpen }),
  setSigningOut: (isSigningOut) => set({ isSigningOut }),
}));
