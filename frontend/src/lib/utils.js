import React from "react";
import toast from "react-hot-toast";

export const validateImageSize = (file, maxSizeMB = 10) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    toast.error(`File size exceeds ${maxSizeMB}MB limit.`);
    return false;
  }
  return true;
};

export const formatMessageTime = (date) => {
  const formattedTime = new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formattedTime;
};
