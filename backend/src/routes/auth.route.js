import express from "express";
import {
  register,
  login,
  logout,
  updateProfile,
  checkAuth,
  testEmail,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import transporter from "../lib/nodemailer.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

// This route shouldn't be accessible without authentication
router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

// Test email route (remove after testing)
router.post("/test-email", testEmail);

export default router;
