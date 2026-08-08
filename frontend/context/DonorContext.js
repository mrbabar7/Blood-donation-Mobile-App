import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "./AuthContext"; // Import AuthContext hook

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const DonorContext = createContext();

export const DonorProvider = ({ children }) => {
  const { user } = useAuth(); // Track auth user state
  const [donorProfile, setDonorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current donor status for the logged in user
  const fetchDonorStatus = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("userToken");

      const response = await fetch(`${API_URL}/api/donors/status`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      if (data.registered && data.donor) {
        setDonorProfile({
          ...data.donor,
          isDonor: true,
        });
      } else {
        setDonorProfile(null);
      }
    } catch (err) {
      console.log("Failed to fetch donor profile status:", err);
      setDonorProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Automatically refresh donor profile when authentication user changes
  useEffect(() => {
    if (user) {
      fetchDonorStatus();
    } else {
      setDonorProfile(null);
      setLoading(false);
    }
  }, [user]);

  const registerDonor = (donorData) => {
    setDonorProfile({
      ...donorData,
      isDonor: true,
      isAvailable: true,
      rating: 0.0,
      livesSaved: 0,
    });
  };

  const updateDonorProfileAPI = async (updatedData) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const response = await fetch(`${API_URL}/api/donors/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const data = await response.json();
        const finalProfile = data.donor || updatedData;
        setDonorProfile({ ...finalProfile, isDonor: true });
        return { success: true, donor: finalProfile };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || "Failed to update profile",
        };
      }
    } catch (err) {
      return { success: false, message: "Network connection error" };
    }
  };

  const deleteDonorProfileAPI = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const response = await fetch(`${API_URL}/api/donors/delete-profile`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        setDonorProfile(null);
        return { success: true };
      } else {
        const data = await response.json();
        return {
          success: false,
          message: data.message || "Failed to delete profile",
        };
      }
    } catch (err) {
      return { success: false, message: "Network connection error" };
    }
  };

  return (
    <DonorContext.Provider
      value={{
        donorProfile,
        loading,
        isDonor: !!donorProfile?.isDonor,
        registerDonor,
        fetchDonorStatus,
        updateDonorProfileAPI,
        deleteDonorProfileAPI,
      }}
    >
      {children}
    </DonorContext.Provider>
  );
};

export const useDonor = () => {
  const context = useContext(DonorContext);
  if (!context) {
    throw new Error("useDonor must be used within a DonorProvider");
  }
  return context;
};
