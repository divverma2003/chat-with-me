import { create } from "zustand";

export const useThemeStore = create((set) => ({
  // Use local storage to avoid unnecessary re-renders + servers-de storage
  // We'll fetch the initial theme from local storage (user's browser)
  theme: localStorage.getItem("user-theme") || "light",
  setTheme: (theme) => {
    localStorage.setItem("user-theme", theme);
    set({ theme });
  },
}));
