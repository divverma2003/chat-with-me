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
