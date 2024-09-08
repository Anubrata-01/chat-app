import { Server as SocketIOServer } from "socket.io";

const setUpSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"], // corrected to 'methods'
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnected = (socket) => {
    // Find and remove the user by socket id from userSocketMap
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        console.log(`User disconnected: ${userId} with socket id: ${socket.id}`);
        break;
      }
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket id: ${socket.id}`);

      // Handle disconnection
      socket.on("disconnect", () => {
        disconnected(socket);
      });
    } else {
      console.log("User not connected, userId not provided");
    }
  });
};

export default setUpSocket;
