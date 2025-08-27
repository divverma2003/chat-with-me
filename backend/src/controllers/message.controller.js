import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// Fetch all users except the current user
export const getUsersForSideBar = async (req, res) => {
  // this function uses the "protectRoute" middleware, so we may grab the current user details from the request body

  try {
    console.log(req.user);
    const currentUserId = req.user._id;

    // fetch all users except the current user (find all users with id not equal to currentUserId)

    // fetch all details except the password to the client
    const filteredUsers = await User.find({
      _id: { $ne: currentUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSideBar controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    // Id of user that sent the message to current user
    const { id: userToChatId } = req.params;
    // Id of the user logged in
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // upload image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // realtime functionality will be added with socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);

    // if the user is online, send the message in real time
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
