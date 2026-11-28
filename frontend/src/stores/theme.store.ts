import { create } from "zustand";

export type ThemePreference = "system" | "light" | "dark";

type ThemeStore = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  preference: "system",
  setPreference: (preference) => set({ preference }),
}));
