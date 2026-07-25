import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  Keyboard,
} from "react-native";
import { State, City } from "country-state-city";
import { useLocation } from "../context/LocationContext";
import { X, Search, Check, MapPin, Droplet, Filter } from "lucide-react-native";
import AppText from "./AppText";
import { MotiView } from "moti";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const countryCode = "PK";
const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function SelectionModal({ visible, type, onClose }) {
  const { province, setProvince, city, setCity, bloodType, setBloodType } =
    useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // --- OPTIMIZED DATA FETCHING ---
  const data = useMemo(() => {
    if (!visible) return []; // Don't process data if modal is hidden

    if (type === "province") {
      return State.getStatesOfCountry(countryCode).map((s) => ({
        label: s.name,
        value: s.isoCode,
      }));
    }
    if (type === "city" && province) {
      return City.getCitiesOfState(countryCode, province).map((c) => ({
        label: c.name,
        value: c.name,
      }));
    }
    if (type === "bloodType") {
      return bloodTypes.map((t) => ({ label: t, value: t }));
    }
    return [];
  }, [type, province, visible]);

  const filteredData = useMemo(
    () =>
      data.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [data, searchQuery],
  );

  // --- FASTER HANDLER ---
  const handleSelect = useCallback(
    (item) => {
      // 1. Dismiss keyboard immediately to prevent UI lag
      Keyboard.dismiss();

      // 2. Trigger close first (Visual feedback)
      onClose();

      // 3. Update state (Wrap in requestAnimationFrame to let animation start first)
      requestAnimationFrame(() => {
        if (type === "province") {
          setProvince(item.value);
          setCity("");
        } else if (type === "city") {
          setCity(item.value);
        } else if (type === "bloodType") {
          setBloodType(item.value);
        }
        setSearchQuery("");
      });
    },
    [type, onClose, setProvince, setCity, setBloodType],
  );

  const renderItem = useCallback(
    ({ item }) => {
      const isSelected =
        (type === "province" && province === item.value) ||
        (type === "city" && city === item.value) ||
        (type === "bloodType" && bloodType === item.value);

      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleSelect(item)}
          className={`flex-row items-center justify-between p-5 mb-2 rounded-2xl border ${
            isSelected ? "bg-red-50 border-red-200" : "bg-white border-gray-100"
          }`}
        >
          <AppText
            variant={isSelected ? "bold" : "medium"}
            className={isSelected ? "text-red-600" : "text-gray-700"}
          >
            {item.label}
          </AppText>
          {isSelected && <Check size={18} color="#ef4444" />}
        </TouchableOpacity>
      );
    },
    [province, city, bloodType, type, handleSelect],
  );

  return (
    <Modal
      animationType="none" // We use Moti for animation instead
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          className="absolute inset-0"
        />

        <MotiView
          from={{ translateY: SCREEN_HEIGHT }}
          animate={{ translateY: visible ? 0 : SCREEN_HEIGHT }}
          transition={{ type: "timing", duration: 250 }} // Faster duration
          className="bg-white rounded-t-[40px] px-6 pt-4 pb-10"
          style={{ height: SCREEN_HEIGHT * 0.75 }} // Slightly shorter for better thumb reach
        >
          <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-6" />

          <View className="flex-row justify-between items-center mb-6">
            <AppText variant="bold" className="text-xl text-gray-900">
              {type === "province"
                ? "Select Province"
                : type === "city"
                  ? "Select City"
                  : "Select Blood Group"}
            </AppText>
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-100 p-2 rounded-full"
            >
              <X size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          {type !== "bloodType" && (
            <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 h-14 mb-4 border border-gray-200">
              <Search size={18} color="#94a3b8" />
              <TextInput
                placeholder={`Search ${type}...`}
                className="flex-1 ml-3 font-bold text-gray-700"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#94a3b8"
                autoCorrect={false}
              />
            </View>
          )}

          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.value}
            renderItem={renderItem}
            initialNumToRender={10} // Performance optimization
            maxToRenderPerBatch={10}
            windowSize={5}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View className="items-center py-20">
                <AppText className="text-gray-400">No results found</AppText>
              </View>
            )}
          />
        </MotiView>
      </View>
    </Modal>
  );
}
