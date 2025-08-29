import express from "express";
import {
  register,
  login,
  logout,
  updateProfile,
  checkAuth,
  verifyEmail,
  resendVerification,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

// This route shouldn't be accessible without authentication
router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

// Email verification route - no auth required
router.get("/verify-email/:token", verifyEmail);

// Resend verification route - no auth required
router.post("/resend-verification", resendVerification);

export default router;
