import { create } from "zustand";
import { connect, io } from "socket.io-client";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios";

const BASE_URL = "http://localhost:5001";
// Global state
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true, // indicates if we are checking authentication (loading)
  isRegistering: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isVerifyingEmail: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      // Check if user is authenticated
      // We already have a base URL configured
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.user }); // Access the user property from the response
      get().connectSocket();
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

      get().connectSocket();
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
      get().connectSocket();
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
      get().disconnectSocket();
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
  verifyEmail: async (token) => {
    if (!token) {
      toast.error("Verification token is required");
      return;
    }

    set({ isVerifyingEmail: true });
    try {
      const res = await axiosInstance.get(`/auth/verify-email/${token}`);
      toast.success("Email verified successfully! You can now log in.");
      return res.data; // Return success data
    } catch (error) {
      console.log("Error in verifyEmail authStore:", error.message);
      const errorMessage =
        error.response?.data?.message || "Email verification failed";
      toast.error(errorMessage);
      throw error; // Re-throw so component can handle it
    } finally {
      set({ isVerifyingEmail: false });
    }
  },

  resendVerification: async (email) => {
    if (!email) {
      toast.error("Email is required.");
      return;
    }

    set({ isVerifyingEmail: true });
    try {
      const res = await axiosInstance.post("/auth/resend-verification", {
        email,
      });
      toast.success("Verification email sent! Please check your inbox.");
      return res.data;
    } catch (error) {
      console.log("Error in resendVerification authStore:", error.message);
      const errorMessage =
        error.response?.data?.message || "Failed to resend verification email";
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isVerifyingEmail: false });
    }
  },
  findUserByToken: async (token) => {
    try {
      const res = await axiosInstance.get(`/auth/find-user/${token}`);
      toast.success("User found for the provided token.");
      return res.data.user;
    } catch (error) {
      console.log("Error in findUserByToken authStore:", error.message);
      // Return empty object instead of throwing error when user not found
      return {};
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    // if the user is already connected or the socket is initialized, return
    if (!authUser || get().socket?.connected) return;

    // pass userId to the socket connection and our backend (socket.js)
    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });
    socket.connect();
    set({ socket: socket });

    // match with backend method passed in socket.js (under emit):
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    // only disconnect if we're already connected
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
