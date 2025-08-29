import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// Fetch all users except the current user
export const getUsersForSideBar = async (req, res) => {
  // this function uses the "protectRoute" middleware, so we may grab the current user details from the request body

  try {
    const currentUserId = req.user._id;

    // Aggregate to get users sorted by most recent message
    const filteredUsers = await User.aggregate([
      // Exclude current user
      { $match: { _id: { $ne: currentUserId } } },

      // Lookup messages where either user sent to current user or current user sent to them
      {
        $lookup: {
          from: "messages",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [
                        { $eq: ["$senderId", "$$userId"] },
                        { $eq: ["$receiverId", currentUserId] },
                      ],
                    },
                    {
                      $and: [
                        { $eq: ["$senderId", currentUserId] },
                        { $eq: ["$receiverId", "$$userId"] },
                      ],
                    },
                  ],
                },
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
          ],
          as: "lastMessage",
        },
      },

      // Add lastMessageTime field for sorting
      {
        $addFields: {
          lastMessageTime: {
            $ifNull: [
              { $arrayElemAt: ["$lastMessage.createdAt", 0] },
              new Date(0),
            ],
          },
        },
      },

      // Sort by most recent message (users with recent messages first)
      { $sort: { lastMessageTime: -1 } },

      // Remove sensitive fields and temporary fields
      {
        $project: {
          password: 0,
          lastMessage: 0,
          lastMessageTime: 0,
        },
      },
    ]);

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
