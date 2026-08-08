// // services/socketService.js
// const { Server } = require("socket.io");
// const { Expo } = require("expo-server-sdk");
// const expo = new Expo();

// let io;

// // Import User model lazily inside functions to prevent circular dependency issues
// const getUserModel = () => require("../models/userMode");

// const initSocket = (server) => {
//   io = new Server(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST", "PUT", "DELETE"],
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("⚡ New Client Connected:", socket.id);

//     // Register User & Join Room
//     socket.on("register_user", async (userId) => {
//       if (!userId) return;

//       const userRoom = userId.toString();
//       socket.join(userRoom);
//       socket.userId = userRoom; // Store on socket object for disconnect lookup

//       console.log(`👤 User ${userId} joined room ${userRoom}`);

//       // Update Database: Set isOnline to true
//       try {
//         const User = getUserModel();
//         await User.findByIdAndUpdate(userId, {
//           isOnline: true,
//           lastSeen: new Date(),
//         });

//         // Broadcast status update to all connected clients
//         io.emit("donor_status_changed", { userId, isOnline: true });
//       } catch (err) {
//         console.error(`Failed to set user ${userId} online:`, err.message);
//       }
//     });

//     // Handle Disconnection
//     socket.on("disconnect", async () => {
//       const userId = socket.userId;
//       console.log(
//         `❌ Client Disconnected: ${socket.id} (User: ${userId || "Guest"})`,
//       );

//       if (userId) {
//         // Check if user has any remaining active sockets in room
//         const roomSockets = io.sockets.adapter.rooms.get(userId);
//         if (!roomSockets || roomSockets.size === 0) {
//           try {
//             const User = getUserModel();
//             await User.findByIdAndUpdate(userId, {
//               isOnline: false,
//               lastSeen: new Date(),
//             });

//             // Broadcast status update to all clients
//             io.emit("donor_status_changed", {
//               userId,
//               isOnline: false,
//               lastSeen: new Date(),
//             });
//           } catch (err) {
//             console.error(`Failed to set user ${userId} offline:`, err.message);
//           }
//         }
//       }
//     });
//   });

//   return io;
// };

// // Returns active Socket.io instance
// const getIO = () => {
//   if (!io) {
//     throw new Error("Socket.io has not been initialized!");
//   }
//   return io;
// };

// // Emit real-time socket event to a specific user's room
// const emitToUser = (userId, event, payload) => {
//   if (io && userId) {
//     io.to(userId.toString()).emit(event, payload);
//   }
// };

// // Send Background Push Notification via Expo
// const sendPushNotification = async (pushToken, title, body, data = {}) => {
//   if (!pushToken || !Expo.isExpoPushToken(pushToken)) {
//     console.log(`[Push Notification Skipped] Invalid Token: ${pushToken}`);
//     return;
//   }

//   const messages = [
//     {
//       to: pushToken,
//       sound: "default",
//       title,
//       body,
//       data, // Used for deep linking navigation (e.g. { screen: "RequestsScreen", requestId: "123" })
//       priority: "high",
//     },
//   ];

//   try {
//     const chunks = expo.chunkPushNotifications(messages);
//     for (let chunk of chunks) {
//       await expo.sendPushNotificationsAsync(chunk);
//     }
//   } catch (error) {
//     console.error("Error sending Expo push notification:", error);
//   }
// };

// // Combined Helper: Emits Socket Event AND Sends Push Notification
// const notifyUser = async ({
//   userId,
//   pushToken,
//   title,
//   body,
//   data,
//   socketEvent,
//   socketPayload,
// }) => {
//   // 1. Emit real-time event for foreground UI updates
//   if (socketEvent) {
//     emitToUser(userId, socketEvent, socketPayload);
//   }

//   // 2. Dispatch push notification for background delivery
//   if (pushToken) {
//     await sendPushNotification(pushToken, title, body, data);
//   }
// };

// module.exports = {
//   initSocket,
//   getIO,
//   emitToUser,
//   sendPushNotification,
//   notifyUser,
// };

const { Server } = require("socket.io");
const { Expo } = require("expo-server-sdk");
const expo = new Expo();

let io;

// Import models lazily to prevent circular dependencies
const getUserModel = () => require("../models/userMode");
const getDonorModel = () => {
  try {
    const donorModule = require("../models/formModel");
    return donorModule.Donor || donorModule; // Extracts Donor model correctly
  } catch (e) {
    return null;
  }
};

// Helper function to set online status in DB
const setUserOnlineStatus = async (userId, isOnline) => {
  if (!userId) return;
  const now = new Date();

  try {
    const User = getUserModel();
    const Donor = getDonorModel();

    const updates = [
      User.findByIdAndUpdate(userId, { isOnline, lastSeen: now }),
    ];

    if (Donor) {
      updates.push(
        Donor.findOneAndUpdate({ userId: userId }, { isOnline, lastSeen: now }),
      );
    }

    await Promise.all(updates);

    // Broadcast status change to all connected clients
    if (io) {
      io.emit("donor_status_changed", {
        userId: userId.toString(),
        isOnline,
        lastSeen: now,
      });
    }
    console.log(
      `🟢 User ${userId} status set to: ${isOnline ? "ONLINE" : "OFFLINE"}`,
    );
  } catch (err) {
    console.error(`Error updating status for user ${userId}:`, err.message);
  }
};

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ New Client Connected:", socket.id);

    // Common handler for both join_room and register_user events
    const handleUserConnect = async (userId) => {
      if (!userId) return;
      const userRoom = userId.toString();
      socket.join(userRoom);
      socket.userId = userRoom;

      console.log(`👤 User ${userId} registered in socket room ${userRoom}`);
      await setUserOnlineStatus(userId, true);
    };

    // Listen to both event names so either client call works
    socket.on("join_room", handleUserConnect);
    socket.on("register_user", handleUserConnect);

    // Handle Disconnection
    socket.on("disconnect", async () => {
      const userId = socket.userId;
      console.log(
        `❌ Client Disconnected: ${socket.id} (User: ${userId || "Guest"})`,
      );

      if (userId) {
        // Check if user has any other active connections open
        const roomSockets = io.sockets.adapter.rooms.get(userId);
        if (!roomSockets || roomSockets.size === 0) {
          await setUserOnlineStatus(userId, false);
        }
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized!");
  }
  return io;
};

const emitToUser = (userId, event, payload) => {
  if (io && userId) {
    io.to(userId.toString()).emit(event, payload);
  }
};

const sendPushNotification = async (pushToken, title, body, data = {}) => {
  if (!pushToken || !Expo.isExpoPushToken(pushToken)) {
    console.log(`[Push Notification Skipped] Invalid Token: ${pushToken}`);
    return;
  }

  const messages = [
    {
      to: pushToken,
      sound: "default",
      title,
      body,
      data,
      priority: "high",
    },
  ];

  try {
    const chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }
  } catch (error) {
    console.error("Error sending Expo push notification:", error);
  }
};

const notifyUser = async ({
  userId,
  pushToken,
  title,
  body,
  data,
  socketEvent,
  socketPayload,
}) => {
  if (socketEvent) {
    emitToUser(userId, socketEvent, socketPayload);
  }
  if (pushToken) {
    await sendPushNotification(pushToken, title, body, data);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitToUser,
  sendPushNotification,
  notifyUser,
};
