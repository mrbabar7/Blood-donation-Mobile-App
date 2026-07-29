import React, { createContext, useContext, useState } from "react";
import {
  PAKISTAN_LOCATIONS,
  BLOOD_GROUPS,
} from "../constants/pakistanLocations";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [modalType, setModalType] = useState(null); // 'bloodType' | 'province' | 'city' | null

  // Get cities dynamically based on selected province
  const availableCities = province ? PAKISTAN_LOCATIONS[province] || [] : [];
  const availableProvinces = Object.keys(PAKISTAN_LOCATIONS);

  const selectProvince = (selectedProv) => {
    setProvince(selectedProv);
    setCity(""); // Reset city when province changes
  };

  const value = {
    province,
    setProvince: selectProvince,
    city,
    setCity,
    bloodType,
    setBloodType,
    modalType,
    setModalType,
    availableProvinces,
    availableCities,
    bloodGroups: BLOOD_GROUPS,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
