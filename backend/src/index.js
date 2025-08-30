import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();
const APP_PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" })); // Increase payload limit for image uploads
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // prevents CORS error when both ports attempt to communicate (frontend with backends)

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// serve API and REACT under the same name
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}
server.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}`);
  connectDB();
});
