// context/DonorContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const DonorContext = createContext();

export const DonorProvider = ({ children }) => {
  const [donorProfile, setDonorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current donor status on initialization
  const fetchDonorStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/donors/status`, {
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("donor response donor :", data);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorStatus();
  }, []);

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
      const response = await fetch(`${API_URL}/api/donors/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
      const response = await fetch(`${API_URL}/api/donors/delete-profile`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
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
