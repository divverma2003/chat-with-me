import React, { useEffect, useRef } from "react";

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
const ChatContainer = () => {
  const {
    messages,
    getMessages,
    sendMessage,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeToMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();

  // auto scroll to receive new message
  const messageEndRef = useRef(null);

  // everytime messages change, scroll to bottom
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // everytime the selected user changes, fetch messages
  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages(); // start listening for new messages (e.g. via sockets)

    // clean up
    return () => unsubscribeToMessages(); // stop listening when component unmounts or dependency changes
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeToMessages,
  ]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="message sender profile picture"
                />
              </div>
            </div>

            {/* TIME */}
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            <div className="chat-bubble flex flex-col gap-2">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mt-2 mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
