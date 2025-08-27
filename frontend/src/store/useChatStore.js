import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/messages/users");
      set({ users: response.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    try {
      // get existing messages sent by the currently selected user
      const response = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      // add messages to state
      set({ messages: [...messages, response.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  setSelectedUser: (selectedUser) => {
    set({
      selectedUser,
    });
  },

  // view messages in real time if we have our chat open
  subscribeToMessages: () => {
    const { selectedUser } = get();

    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      // only add message if it's from the user we're currently chatting with (selectedUser)
      if (newMessage.senderId !== selectedUser._id) return;
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  // remove websocket listener for messages after logging out, or closing chat
  unsubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
