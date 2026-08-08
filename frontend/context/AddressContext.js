import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import * as SecureStore from "expo-secure-store";
// Replace with your API config/axios instance if available
import axios from "axios";

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const { user, sharedToken: token } = useAuth() || {};
  const [addresses, setAddresses] = useState([]);
  const [primaryAddress, setPrimaryAddressState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Axios config with authorization header
  // const getAuthConfig = () => ({
  //   headers: { Authorization: `Bearer ${token}` },
  // });

  const getAuthConfig = () => ({
    headers: { "Content-Type": "application/json" },
    Credentials: "include",
  });
  // Fetch all user addresses
  const fetchAddresses = async () => {
    if (!user && !token) {
      console.log("No user or token found, clearing addresses.");
      setAddresses([]);
      setPrimaryAddressState(null);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL || ""}/api/addresses`,
        getAuthConfig(),
      );
      if (response.data.success) {
        const fetchedData = response.data.data || [];
        setAddresses(fetchedData);
        const primary = fetchedData.find((addr) => addr.isPrimary);
        setPrimaryAddressState(primary || fetchedData[0] || null);
      }
    } catch (error) {
      console.log(
        "Error fetching addresses:",
        error?.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  // Add new address (backend auto-sets as primary)
  const addAddress = async (addressData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL || ""}/api/addresses`,
        addressData,
        getAuthConfig(),
      );
      if (response.data.success) {
        await fetchAddresses();
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Failed to add address",
      };
    } finally {
      setLoading(false);
    }
  };

  // Set an address as Primary
  const selectPrimaryAddress = async (id) => {
    try {
      const response = await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL || ""}/api/addresses/${id}/primary`,
        {},
        getAuthConfig(),
      );
      if (response.data.success) {
        await fetchAddresses();
      }
    } catch (error) {
      console.error(
        "Error setting primary address:",
        error?.response?.data || error.message,
      );
    }
  };

  // Delete an address
  const deleteAddress = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.EXPO_PUBLIC_API_URL || ""}/api/addresses/${id}`,
        getAuthConfig(),
      );
      if (response.data.success) {
        await fetchAddresses();
      }
    } catch (error) {
      console.error(
        "Error deleting address:",
        error?.response?.data || error.message,
      );
    }
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        primaryAddress,
        loading,
        modalVisible,
        openAddressModal: () => setModalVisible(true),
        closeAddressModal: () => setModalVisible(false),
        fetchAddresses,
        addAddress,
        selectPrimaryAddress,
        deleteAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
};
