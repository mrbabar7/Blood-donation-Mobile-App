// import React, {
//   createContext,
//   useState,
//   useEffect,
//   useContext,
//   useCallback,
// } from "react";
// import { Platform } from "react-native";
// import * as SecureStore from "expo-secure-store";

// const AuthContext = createContext();
// const API_URL = process.env.EXPO_PUBLIC_API_URL;

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Storage Helpers
//   const getStorageItem = async (key) => {
//     try {
//       if (Platform.OS === "web") return localStorage.getItem(key);
//       return await SecureStore.getItemAsync(key);
//     } catch (e) {
//       console.error("Storage Read Error:", e);
//       return null;
//     }
//   };

//   const setStorageItem = async (key, value) => {
//     try {
//       if (Platform.OS === "web") {
//         localStorage.setItem(key, value);
//       } else {
//         await SecureStore.setItemAsync(key, value);
//       }
//     } catch (e) {
//       console.error("Storage Write Error:", e);
//     }
//   };

//   const removeStorageItem = async (key) => {
//     try {
//       if (Platform.OS === "web") {
//         localStorage.removeItem(key);
//       } else {
//         await SecureStore.deleteItemAsync(key);
//       }
//     } catch (e) {
//       console.error("Storage Delete Error:", e);
//     }
//   };

//   // Check Authentication State
//   const checkAuth = useCallback(async () => {
//     try {
//       const token = await getStorageItem("userToken");
//       const savedUser = await getStorageItem("user");

//       if (savedUser) {
//         try {
//           setUser(JSON.parse(savedUser));
//         } catch (e) {
//           console.error("Error parsing stored user:", e);
//         }
//       }

//       if (!token) {
//         setUser(null);
//         return;
//       }

//       // Verify token against backend
//       const res = await fetch(`${API_URL}/auth/verify`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.ok) {
//         const data = await res.json();
//         const activeUser = data.user || data;
//         setUser(activeUser);
//         await setStorageItem("user", JSON.stringify(activeUser));
//       } else if (res.status === 401 || res.status === 403) {
//         await logout();
//       }
//     } catch (err) {
//       console.log("Auth Check Error (using offline data if present):", err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // Complete Logout Procedure
//   const logout = async () => {
//     try {
//       const token = await getStorageItem("userToken");
//       if (token) {
//         // Optional backend logout call
//         fetch(`${API_URL}/api/auth/logout`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }).catch(() => {});
//       }
//     } catch (e) {
//       console.error("Logout request error:", e);
//     } finally {
//       setUser(null);
//       await removeStorageItem("userToken");
//       await removeStorageItem("user");
//     }
//   };

//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);

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
import { registerForPushNotificationsAsync } from "../services/api/notificationService"; // 👈 Import helper

const AuthContext = createContext();
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sharedToken, setSharedToken] = useState(null);
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

  // 🌟 HELPER FUNCTION: Get Device Token & Send to Backend Database
  const saveDevicePushToken = async (token) => {
    try {
      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken && token) {
        await fetch(`${API_URL}/auth/save-push-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ pushToken }),
        });
        console.log(" Push Token registered on backend:", pushToken);
      }
    } catch (error) {
      console.log("Push Token Registration Error:", error);
    }
  };

  // Check Authentication State
  const checkAuth = useCallback(async () => {
    try {
      const token = await getStorageItem("userToken");
      console.log("Checking auth with token:", token);
      const savedUser = await getStorageItem("user");
      if (!token) {
        setUser(null);
        return;
      }
      if (savedUser && token) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          setUser(null);
          console.log("Error parsing stored user:", e);
        }
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
        setSharedToken(token);
        // 🌟 REGISTER PUSH TOKEN WHEN AUTH IS CONFIRMED
        saveDevicePushToken(token);
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
        fetch(`${API_URL}/auth/logout`, {
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
        setSharedToken,
        sharedToken,
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
