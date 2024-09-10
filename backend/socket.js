
import { Server as SocketIOServer } from "socket.io";
import MessageModel from "./models/MessagesModel.js";
const setUpSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN, 
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  
  const userSocketMap = new Map();
  const sendMessage = async ({ senderId, recipientId, content, messageType }) => {
    console.log("sendMessage params:", { senderId, recipientId, content, messageType });

    try {
    
      if (!senderId || !recipientId || !content || !messageType) {
        throw new Error("All fields (senderId, recipientId, content, messageType) are required.");
      }

      await MessageModel.create({ senderId, recipientId, content, messageType });
      const recipientSocketId = userSocketMap.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receive_message", { senderId, content, messageType });
      }
      io.to(userSocketMap.get(senderId)).emit("receive_message", { senderId, content, messageType });

      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket id: ${socket.id}`);
      socket.on("send_message", sendMessage);
      socket.on("disconnect", () => {
        userSocketMap.forEach((socketId, mapUserId) => {
          if (socketId === socket.id) {
            userSocketMap.delete(mapUserId);
            console.log(`User disconnected: ${mapUserId} with socket id: ${socket.id}`);
          }
        });
      });
    } else {
      console.log("User not connected, userId not provided");
    }
  });
};

export default setUpSocket;
