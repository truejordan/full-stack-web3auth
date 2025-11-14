import { create } from "zustand";
/** This is store is used to swap uniwind themes with setTheme */

interface ThemeState {
  themeStore: ThemeTypes;
  setTheme: (theme: ThemeTypes) => void;
}

type ThemeTypes =  "light"| "dark"| "alpha-light" | "alpha-dark";

export const useThemeStore = create<ThemeState>((set) => ({
  themeStore: "alpha-dark",
  setTheme: (themeStore: ThemeTypes) => set({ themeStore }),
}));