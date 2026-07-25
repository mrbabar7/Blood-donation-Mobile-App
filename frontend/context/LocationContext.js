import React, { createContext, useContext, useState, useMemo } from "react";
import { State, City } from "country-state-city";

const LocationContext = createContext();
const countryCode = "PK";

export const LocationProvider = ({ children }) => {
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [modalType, setModalType] = useState(null);
  // Memoize the data once at the provider level
  const allProvinces = useMemo(() => State.getStatesOfCountry(countryCode), []);

  const allCities = useMemo(
    () => (province ? City.getCitiesOfState(countryCode, province) : []),
    [province],
  );

  const value = {
    province,
    setProvince,
    city,
    setCity,
    bloodType,
    setBloodType,
    allProvinces,
    allCities,
    countryCode,
    modalType, // Export the state
    setModalType,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
