import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import axios from "axios";

// Global state
export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true, // indicates if we are checking authentication (loading)
  isRegistering: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      // Check if user is authenticated
      // We already have a base URL configured
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  register: async (data) => {},
}));
