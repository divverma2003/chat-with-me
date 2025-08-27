import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}
// store online users {userId: socketId}
const userSocketMap = {};

// Log connection and disconnection events (while listening)
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // passed from getSocket (useAuthStore)
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // broadcast to all connected users that user is connects (send event)
  // send name of the method we'll use + userSocketMap keys
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    // remove from userSocketMap if the user disconnects, display updated
    // map
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
