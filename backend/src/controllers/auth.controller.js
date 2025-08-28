import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import transporter from "../lib/nodemailer.js";

export const register = async (req, res) => {
  // Get user details from request body
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Ensure user's password meets requirements
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }
    // Check if there's a user that already exists in our collection
    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already in use." });

    // Create a salt that undergoes 10 rounds
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate JWT token
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        message: "User created successfully.",
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res
        .status(400)
        .json({ message: "Failed to create user. Invalid user data." });
    }
  } catch (error) {
    console.log("Error occurred in register controller:", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
  res.send("User registration");
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // check if user exists in collection
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    // Now, decrypt the stored password with the password the user input to verify they match.

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    generateToken(user._id, res);
    res.status(200).json({
      message: "Login successful.",
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error occurred in login controller:", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const logout = (req, res) => {
  // Clear cookies
  try {
    res.cookie("jwtCookie", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.log("Error occurred in logout controller:", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    // we can directly access the user object since this function uses the protectRoute middleware
    const userId = req.user._id;

    // grab the user's current profile picture URL
    const currentProfilePic = req.user.profilePic;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required." });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    // update the user object with the new profile picture URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );

    // If the upload was successful, delete the old profile picture from Cloudinary
    if (currentProfilePic && currentProfilePic.includes("cloudinary.com")) {
      try {
        console.log("Current profile picture URL:", currentProfilePic);
        const publicId = currentProfilePic.split("/").pop().split(".")[0];
        console.log("Deleting old profile picture from Cloudinary:", publicId);

        const deleteResult = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary deletion result:", deleteResult);

        if (deleteResult.result === "ok") {
          console.log("Old profile picture deleted successfully");
        } else {
          console.log(
            "Failed to delete old profile picture:",
            deleteResult.result
          );
        }
      } catch (deleteError) {
        console.log("Error deleting old profile picture:", deleteError.message);
        // Don't fail the whole request if deletion fails
      }
    } else {
      console.log(
        "No previous Cloudinary image to delete or it's a default image"
      );
    }

    res
      .status(200)
      .json({ message: "Profile picture updated successfully.", updatedUser });
  } catch (error) {
    console.log("Error occurred in updateProfile controller:", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.log("Error occurred in checkAuth controller:", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// Test email function - remove after testing
export const testEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Test Email - Chat With Me",
      html: `
        <h1>Test Email</h1>
        <p>If you received this email, your nodemailer configuration is working correctly!</p>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      `,
    };

    console.log("Attempting to send test email to:", email);
    await transporter.sendMail(mailOptions);
    console.log("✅ Test email sent successfully!");

    res.status(200).json({
      message: "Test email sent successfully!",
      to: email,
    });
  } catch (error) {
    console.log("❌ Test email failed:", error.message);
    res.status(500).json({
      message: "Failed to send test email",
      error: error.message,
    });
  }
};
