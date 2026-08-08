// import React, { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import * as Notifications from "expo-notifications";
// import { useAuth } from "./AuthContext";

// const SocketContext = createContext({
//   socket: null,
//   isConnected: false,
// });

// const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL;

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const { user } = useAuth();

//   useEffect(() => {
//     const userId = user?._id || user?.id;

//     if (!userId) {
//       if (socket) {
//         socket.disconnect();
//         setSocket(null);
//         setIsConnected(false);
//       }
//       return;
//     }

//     const newSocket = io(SOCKET_URL, {
//       transports: ["websocket"],
//       reconnection: true,
//       reconnectionAttempts: 10,
//       reconnectionDelay: 2000,
//     });

//     newSocket.on("connect", () => {
//       console.log("⚡ Connected to Socket Server:", newSocket.id);
//       setIsConnected(true);
//       newSocket.emit("join_room", userId);
//     });

//     newSocket.on("disconnect", () => {
//       console.log("❌ Socket Disconnected");
//       setIsConnected(false);
//     });

//     // Handle real-time incoming notification over WebSocket
//     newSocket.on("new_notification_received", async (notification) => {
//       console.log("🔔 Real-time Socket Notification Received:", notification);

//       // Trigger local notification pop-up for immediate user feedback
//       try {
//         await Notifications.scheduleNotificationAsync({
//           content: {
//             title: notification.title || "New Notification 🩸",
//             body:
//               notification.message || "You have a new update in Blood Connect.",
//             data: notification.data || { link: notification.link },
//             sound: true,
//           },
//           trigger: null, // Display immediately
//         });
//       } catch (err) {
//         console.error("Failed to present local notification:", err);
//       }
//     });

//     setSocket(newSocket);

//     return () => {
//       newSocket.off("connect");
//       newSocket.off("disconnect");
//       newSocket.off("new_notification_received");
//       newSocket.disconnect();
//     };
//   }, [user?._id, user?.id]);

//   return (
//     <SocketContext.Provider value={{ socket, isConnected }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => useContext(SocketContext);

import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import * as Notifications from "expo-notifications";
import { useAuth } from "./AuthContext";

const SocketContext = createContext({
  socket: null,
  isConnected: false,
});

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL;

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const userId = user?._id || user?.id;

    if (!userId) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    newSocket.on("connect", () => {
      console.log("⚡ Connected to Socket Server:", newSocket.id);
      setIsConnected(true);

      // Emit both events to guarantee server handles registration
      newSocket.emit("join_room", userId);
      newSocket.emit("register_user", userId);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket Disconnected");
      setIsConnected(false);
    });

    // Handle real-time incoming notifications over WebSocket
    newSocket.on("new_notification_received", async (notification) => {
      console.log("🔔 Real-time Socket Notification Received:", notification);

      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title || "New Notification 🩸",
            body:
              notification.message || "You have a new update in Blood Connect.",
            data: notification.data || { link: notification.link },
            sound: true,
          },
          trigger: null,
        });
      } catch (err) {
        console.error("Failed to present local notification:", err);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.off("new_notification_received");
      newSocket.disconnect();
    };
  }, [user?._id, user?.id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
