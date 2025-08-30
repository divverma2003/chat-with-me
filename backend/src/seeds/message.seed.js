import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

config();

const seedMessagesInDB = async () => {
  try {
    await connectDB();

    // Remove all existing messages
    await Message.deleteMany({});
    console.log("Old messages removed.");

    // Find users by email (make sure they exist from your user seeder)
    const lily = await User.findOne({ email: "lily.evans@example.com" });
    const ella = await User.findOne({ email: "ella.parker@example.com" });
    const mason = await User.findOne({ email: "mason.hall@example.com" });

    if (!lily || !ella || !mason) {
      throw new Error(
        "One or more seed users not found. Run user seeder first."
      );
    }

    // Example conversation messages
    const messages = [
      {
        senderId: lily._id,
        receiverId: ella._id,
        text: "Hey Ella! How’s your day going?",
        isRead: true,
      },
      {
        senderId: ella._id,
        receiverId: lily._id,
        text: "Hi Lily! Pretty good, just finished my classes.",
        isRead: false,
      },
      {
        senderId: mason._id,
        receiverId: lily._id,
        text: "Hey Lily, are you joining the group study later?",
        isRead: false,
      },
      {
        senderId: lily._id,
        receiverId: mason._id,
        text: "Yes Mason, I’ll be there at 6pm!",
        isRead: true,
      },
      {
        senderId: mason._id,
        receiverId: ella._id,
        text: "Ella, do you want me to send you the notes?",
        isRead: false,
      },
      {
        senderId: ella._id,
        receiverId: mason._id,
        text: "That would be awesome, thanks Mason!",
        isRead: true,
      },
    ];

    // Insert messages
    await Message.insertMany(messages);
    console.log("Messages seeded successfully.");
  } catch (error) {
    console.error("Error seeding messages:", error.message);
  } finally {
    process.exit();
  }
};

seedMessagesInDB();
