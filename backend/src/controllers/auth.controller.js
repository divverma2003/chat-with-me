import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import {
  generateToken,
  generateVerificationToken,
  prepareVerificationEmail,
} from "../lib/utils.js";
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

    // Generate verification token
    const verificationToken = generateVerificationToken();

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      isVerified: false, // User starts unverified
    });

    await newUser.save();
    console.log("User saved successfully:", newUser._id);

    // Send verification email
    const mailOptions = prepareVerificationEmail(
      verificationToken,
      email,
      fullName
    );

    try {
      await transporter.sendMail(mailOptions);
      console.log("Verification email sent successfully to:", email);

      res.status(201).json({
        message:
          "Registration successful! Please check your email to verify your account before logging in.",
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        isVerified: newUser.isVerified,
      });
    } catch (emailError) {
      console.log("Failed to send verification email:", emailError.message);

      // Delete the user if email fails
      await User.findByIdAndDelete(newUser._id);

      res.status(500).json({
        message:
          "Registration failed. Could not send verification email. Please try again.",
        error: emailError.message,
      });
    }
  } catch (error) {
    console.log("Error occurred in register controller:", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("Login request received:", { email, password: "***" });

  try {
    if (!email || !password) {
      console.log("Missing login fields:", {
        email: !!email,
        password: !!password,
      });
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // check if user exists in collection
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ message: "Invalid credentials." });
    }

    console.log("User found, isVerified:", user.isVerified);

    // Check if user is verified
    if (!user.isVerified) {
      console.log("User not verified:", email);
      return res.status(400).json({
        message:
          "Please verify your email before logging in. Check your inbox for the verification link.",
      });
    }

    // Now, decrypt the stored password with the password the user input to verify they match.
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(400).json({ message: "Invalid credentials." });
    }

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

// Email verification endpoint
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log("Email verification requested with token:", token);

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Invalid or expired verification token:", token);
      return res.status(400).json({
        message:
          "Invalid or expired verification token. Please request a new verification email.",
      });
    }

    // Verify the user
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    console.log("Email verified successfully for user:", user.email);

    res.status(200).json({
      message: "Email verified successfully! You can now log in.",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.log("Error in verifyEmail controller:", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
