import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import {
  generateToken,
  generateVerificationToken,
  prepareVerificationEmail,
} from "../lib/utils.js";
import transporter from "../lib/nodemailer.js";

// Resend verification email
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    console.log("Resend verification requested for:", email);

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        message:
          "If an account with that email exists, a verification email has been sent.",
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        message: "This email is already verified. You can log in now.",
      });
    }

    // Rate limiting: Check if last verification was sent recently
    const now = Date.now();
    const lastSent = user.verificationTokenExpires - 24 * 60 * 60 * 1000; // Calculate when it was sent
    const timeSinceLastSent = now - lastSent;
    const fiveMinutes = 5 * 60 * 1000;

    if (timeSinceLastSent < fiveMinutes) {
      return res.status(429).json({
        message:
          "Please wait 5 minutes before requesting another verification email.",
      });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();

    // Update user with new token
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send verification email
    const mailOptions = prepareVerificationEmail(
      verificationToken,
      email,
      user.fullName
    );

    await transporter.sendMail(mailOptions);
    console.log("Verification email resent successfully to:", email);

    res.status(200).json({
      message:
        "Verification email sent! Please check your inbox and spam folder.",
    });
  } catch (error) {
    console.log("Error in resendVerification controller:", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

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

    // Note: We'll allow login regardless of verification status
    // Frontend will handle redirecting unverified users to verification page

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
      isVerified: user.isVerified, // ✅ Include verification status
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

    res.status(200).json({
      message: "Profile picture updated successfully.",
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      isVerified: updatedUser.isVerified,
      createdAt: updatedUser.createdAt,
    });
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
          "Invalid or expired verification token. Please try verifying your email again.",
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

// Find user from verification token (regardless of expiry)
export const getUserFromToken = async (req, res) => {
  try {
    const { token } = req.params;

    console.log("Searching for user with token:", token);
    const user = await User.findOne({
      verificationToken: token,
    });

    if (!user) {
      console.log("Invalid verification token:", token);
      return res.status(400).json({
        message:
          "Invalid verification token. Please try verifying your email again.",
      });
    }
    res.status(200).json({
      message: "User found!",
      user: {
        _id: user._id,
        email: user.email,
        verificationToken: user.verificationToken,
      },
    });
  } catch (error) {
    console.log(
      "Error occurred in getUserFromToken auth controller:",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error." });
  }
};
