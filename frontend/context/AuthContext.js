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

//   const logout = async () => {
//     setUser(null);
//     await removeStorageItem("userToken");
//     await removeStorageItem("user");
//   };

//   const checkAuth = async () => {
//     try {
//       console.log("Starting Auth Check...");
//       const token = await getStorageItem("userToken");
//       const savedUser = await getStorageItem("user");

//       // 1. Instantly set user from local storage if available (fast/offline load)
//       if (savedUser) {
//         try {
//           setUser(JSON.parse(savedUser));
//         } catch (e) {
//           console.log("Error parsing stored user:", e);
//         }
//       }

//       if (!token) {
//         console.log("No token found, user is not authenticated");
//         setUser(null);
//         return;
//       }

//       // 2. Verify token with backend (Added /api path prefix)
//       console.log("Verifying token with backend...");
//       const res = await fetch(`${API_URL}/auth/verify`, {
//         method: "GET",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.ok) {
//         const data = await res.json();
//         console.log("Auth Check Success:", data);
//         const activeUser = data.user || data;
//         setUser(activeUser);
//         await setStorageItem("user", JSON.stringify(activeUser));
//       } else if (res.status === 401 || res.status === 403) {
//         // Token is genuinely invalid/expired -> Clear storage
//         console.log("Token expired or invalid, logging out");
//         await logout();
//       }
//     } catch (err) {
//       console.log("Auth Check Network/Server Error:", err);
//       // Keeps offline user set in step 1 intact if backend fails to connect
//     } finally {
//       setIsLoading(false);
//     }
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
//         logout,
//         checkAuth,
//         setStorageItem,
//         getStorageItem,
//         removeStorageItem,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext();
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Storage Helpers
  const getStorageItem = async (key) => {
    try {
      if (Platform.OS === "web") return localStorage.getItem(key);
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      console.error("Storage Read Error:", e);
      return null;
    }
  };

  const setStorageItem = async (key, value) => {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (e) {
      console.error("Storage Write Error:", e);
    }
  };

  const removeStorageItem = async (key) => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (e) {
      console.error("Storage Delete Error:", e);
    }
  };

  // Check Authentication State
  const checkAuth = useCallback(async () => {
    try {
      const token = await getStorageItem("userToken");
      const savedUser = await getStorageItem("user");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Error parsing stored user:", e);
        }
      }

      if (!token) {
        setUser(null);
        return;
      }

      // Verify token against backend
      const res = await fetch(`${API_URL}/auth/verify`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const activeUser = data.user || data;
        setUser(activeUser);
        await setStorageItem("user", JSON.stringify(activeUser));
      } else if (res.status === 401 || res.status === 403) {
        await logout();
      }
    } catch (err) {
      console.log("Auth Check Error (using offline data if present):", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Complete Logout Procedure
  const logout = async () => {
    try {
      const token = await getStorageItem("userToken");
      if (token) {
        // Optional backend logout call
        fetch(`${API_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => {});
      }
    } catch (e) {
      console.error("Logout request error:", e);
    } finally {
      setUser(null);
      await removeStorageItem("userToken");
      await removeStorageItem("user");
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
