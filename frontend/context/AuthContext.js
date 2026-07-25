// import React, { createContext, useState, useEffect, useContext } from "react";
// import { Platform } from "react-native";
// import * as SecureStore from "expo-secure-store";

// const AuthContext = createContext();
// const API_URL = process.env.EXPO_PUBLIC_API_URL;

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Helper for Storage (Web vs Mobile)
//   const getStorageItem = async (key) => {
//     if (Platform.OS === "web") return localStorage.getItem(key);
//     return await SecureStore.getItemAsync(key);
//   };

//   const setStorageItem = async (key, value) => {
//     if (Platform.OS === "web") {
//       localStorage.setItem(key, value);
//     } else {
//       await SecureStore.setItemAsync(key, value);
//     }
//   };

//   const removeStorageItem = async (key) => {
//     if (Platform.OS === "web") {
//       localStorage.removeItem(key);
//     } else {
//       await SecureStore.deleteItemAsync(key);
//     }
//   };

//   const checkAuth = async () => {
//     try {
//       console.log("start api call");
//       const token = await getStorageItem("userToken");
//       const savedUser = await getStorageItem("user");

//       if (!token) {
//         console.log("No token found, user is not authenticated");
//         setUser(null);
//       } else {
//         // Verify token with backend
//         console.log("Verifying token with backend");
//         const res = await fetch(`${API_URL}/auth/verify`, {
//           method: "GET",
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (res.ok) {
//           const data = await res.json();
//           console.log("Auth Check Success:", data);
//           setUser(data.user);
//           // Sync storage with fresh user data from server
//           await setStorageItem("user", JSON.stringify(data.user));
//         } else {
//           // Token is invalid/expired - clear everything
//           await logout();
//         }
//       }
//     } catch (err) {
//       console.log("Auth Check Error:", err);
//       // Optional: if server is down, fallback to local saved user so app isn't "broken"
//       const offlineUser = await getStorageItem("user");
//       if (offlineUser) setUser(JSON.parse(offlineUser));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = async () => {
//     setUser(null);
//     await removeStorageItem("userToken");
//     await removeStorageItem("user");
//   };

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         setUser,
//         isLoading,
//         logout, // Added for your Profile screen
//         setStorageItem,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useState, useEffect, useContext } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext();
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper for Storage (Web vs Mobile)
  const getStorageItem = async (key) => {
    if (Platform.OS === "web") return localStorage.getItem(key);
    return await SecureStore.getItemAsync(key);
  };

  const setStorageItem = async (key, value) => {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  };

  const removeStorageItem = async (key) => {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  };

  const logout = async () => {
    setUser(null);
    await removeStorageItem("userToken");
    await removeStorageItem("user");
  };

  const checkAuth = async () => {
    try {
      console.log("Starting Auth Check...");
      const token = await getStorageItem("userToken");
      const savedUser = await getStorageItem("user");

      // 1. Instantly set user from local storage if available (fast/offline load)
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.log("Error parsing stored user:", e);
        }
      }

      if (!token) {
        console.log("No token found, user is not authenticated");
        setUser(null);
        return;
      }

      // 2. Verify token with backend (Added /api path prefix)
      console.log("Verifying token with backend...");
      const res = await fetch(`${API_URL}/auth/verify`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Auth Check Success:", data);
        const activeUser = data.user || data;
        setUser(activeUser);
        await setStorageItem("user", JSON.stringify(activeUser));
      } else if (res.status === 401 || res.status === 403) {
        // Token is genuinely invalid/expired -> Clear storage
        console.log("Token expired or invalid, logging out");
        await logout();
      }
    } catch (err) {
      console.log("Auth Check Network/Server Error:", err);
      // Keeps offline user set in step 1 intact if backend fails to connect
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        logout,
        checkAuth,
        setStorageItem,
        getStorageItem,
        removeStorageItem,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
