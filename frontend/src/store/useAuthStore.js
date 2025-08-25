import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

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
      set({ authUser: res.data.user }); // Access the user property from the response
    } catch (error) {
      console.log("Error in checkAuth authStore:", error.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      // send login request to the backend
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully!");
    } catch (error) {
      console.log("Error in login authStore:", error.message);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  register: async (data) => {
    set({ isRegistering: true });
    try {
      // send data to backend endpoint
      const res = await axiosInstance.post("/auth/register", data);
      set({ authUser: res.data });
      toast.success("Account created successfully!");
    } catch (error) {
      console.log("Error in register authStore:", error.message);
      toast.error(error.response.data.message);
    } finally {
      set({ isRegistering: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");
    } catch (error) {
      console.log("Error in logout authStore:", error.message);
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile info successfully updated!");
    } catch (error) {
      console.log("Error in updateProfile authStore:", error.message);

      // Handle specific error cases
      if (error.response?.status === 413) {
        toast.error(
          "Image file is too large. Please choose a smaller image (max 10MB)."
        );
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
