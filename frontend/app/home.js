import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
  TextInput,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router"; // This requires the component to be inside /app folder tree
import { MotiView, AnimatePresence } from "moti";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../components/AppText";
import { State, City } from "country-state-city";
import HomeBanner from "../assets/home.png";

// Pro-tip: Use your computer's local IP (e.g., 192.168.1.10) for physical device testing
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const countryCode = "PK";

export default function Home() {
  const router = useRouter();
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const allProvinces = useMemo(() => State.getStatesOfCountry(countryCode), []);
  const allCities = useMemo(
    () => (province ? City.getCitiesOfState(countryCode, province) : []),
    [province],
  );

  const filteredData = useMemo(() => {
    const source = modalType === "province" ? allProvinces : allCities;
    if (!searchQuery) return source.slice(0, 50);
    return source.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [modalType, searchQuery, allProvinces, allCities]);

  const closeModal = () => {
    setSearchQuery("");
    setModalType(null);
  };

  const handleFindDonors = async () => {
    // Basic validation
    if (!province || !city || !bloodType) {
      Alert.alert(
        "Missing Info",
        "Please select province, city, and blood type.",
      );
      return;
    }

    setLoading(true);
    try {
      const query = new URLSearchParams({
        province,
        district: city,
        bloodType,
      }).toString();

      const response = await fetch(
        `${API_URL}/api/seeker/hero/search?${query}`,
      );
      const data = await response.json();

      // Ensure your file app/donor-results.js (or .tsx) exists!
      router.push({
        pathname: "/donor-results",
        params: {
          donors: JSON.stringify(data),
          city: city,
          bloodType: bloodType,
        },
      });
    } catch (err) {
      console.error("Search Error:", err);
      Alert.alert(
        "Connection Error",
        "Could not reach the server. Check your IP/Network.",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        onPress={() => {
          if (modalType === "province") {
            setProvince(item.isoCode);
            setCity(""); // Reset city when province changes
          } else {
            setCity(item.name);
          }
          closeModal();
        }}
        className="py-5 border-b border-slate-50 flex-row justify-between items-center"
      >
        <AppText variant="medium" className="text-lg text-slate-700">
          {item.name}
        </AppText>
        <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
      </TouchableOpacity>
    ),
    [modalType],
  );

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Banner Section */}
        <View className="w-full aspect-[16/9] overflow-hidden">
          <Image
            source={HomeBanner}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-red-900/10" />
        </View>

        {/* Search Card */}
        <MotiView
          from={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mx-5 -mt-10 bg-white rounded-[40px] p-6 shadow-2xl shadow-red-200 border border-red-50"
        >
          <View className="flex-row items-center mb-6 px-2">
            <View className="w-2 h-6 bg-red-600 rounded-full mr-3" />
            <AppText variant="bold" className="text-xl text-slate-800">
              Quick Search
            </AppText>
          </View>

          <View className="space-y-4">
            {/* Province Selection */}
            <TouchableOpacity
              onPress={() => setModalType("province")}
              className="flex-row items-center bg-red-50/50 h-16 px-5 rounded-2xl border border-red-100 mb-4"
            >
              <View className="bg-white p-2 rounded-xl shadow-sm">
                <Ionicons name="map-sharp" size={20} color="#dc2626" />
              </View>
              <View className="ml-4 flex-1">
                <AppText className="text-[10px] text-red-400 font-bold uppercase tracking-wider">
                  Province
                </AppText>
                <AppText variant="medium" className="text-slate-700 text-base">
                  {province
                    ? State.getStateByCodeAndCountry(province, countryCode)
                        ?.name
                    : "Select Province"}
                </AppText>
              </View>
            </TouchableOpacity>

            {/* City Selection */}
            <TouchableOpacity
              onPress={() => province && setModalType("city")}
              disabled={!province}
              className={`flex-row items-center bg-red-50/50 h-16 px-5 rounded-2xl border border-red-100 ${!province && "opacity-50"}`}
            >
              <View className="bg-white p-2 rounded-xl shadow-sm">
                <Ionicons name="location-sharp" size={20} color="#dc2626" />
              </View>
              <View className="ml-4 flex-1">
                <AppText className="text-[10px] text-red-400 font-bold uppercase tracking-wider">
                  City
                </AppText>
                <AppText variant="medium" className="text-slate-700 text-base">
                  {city || "Select City"}
                </AppText>
              </View>
            </TouchableOpacity>
          </View>

          {/* Blood Type Grid */}
          <View className="mt-8 mb-6">
            <AppText
              variant="bold"
              className="text-xs text-slate-400 uppercase mb-4 ml-2"
            >
              Select Blood Type
            </AppText>
            <View className="flex-row flex-wrap justify-between">
              {bloodTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  // onPress={() => setBloodType(type)}
                  className={`w-[23%] aspect-square rounded-2xl items-center justify-center mb-3 border-2 ${
                    bloodType === type
                      ? "bg-red-600 border-red-600 shadow-lg shadow-red-200"
                      : "bg-white border-slate-100"
                  }`}
                >
                  <AppText
                    variant="bold"
                    className={`text-lg ${bloodType === type ? "text-white" : "text-slate-600"}`}
                  >
                    {type}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Search Button */}
          <TouchableOpacity
            onPress={handleFindDonors}
            className={`h-16 rounded-2xl flex-row items-center justify-center shadow-xl ${
              !bloodType || !city ? "bg-slate-200" : "bg-red-600 shadow-red-200"
            }`}
            disabled={!bloodType || !city || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="search-outline" size={22} color="white" />
                <AppText variant="bold" className="text-white ml-2 text-lg">
                  Find Donors
                </AppText>
              </>
            )}
          </TouchableOpacity>
        </MotiView>
      </ScrollView>

      {/* Modal for Selection */}
      <AnimatePresence>
        {modalType && (
          <Modal
            transparent
            visible={!!modalType}
            animationType="none"
            onRequestClose={closeModal}
          >
            <View className="flex-1 justify-end">
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50"
              >
                <Pressable className="flex-1" onPress={closeModal} />
              </MotiView>

              <MotiView
                from={{ translateY: 500 }}
                animate={{ translateY: 0 }}
                exit={{ translateY: 500 }}
                transition={{ type: "timing", duration: 300 }}
                className="bg-white rounded-t-[40px] h-[75%] px-6 pt-10 shadow-2xl"
              >
                <View className="w-12 h-1.5 bg-slate-200 rounded-full self-center mb-8" />
                <AppText
                  variant="bold"
                  className="text-2xl text-slate-800 mb-6"
                >
                  Select {modalType}
                </AppText>

                <View className="bg-slate-50 rounded-2xl flex-row items-center px-4 h-14 mb-6 border border-slate-100">
                  <Ionicons name="search" size={20} color="#94a3b8" />
                  <TextInput
                    className="flex-1 ml-2 font-medium"
                    placeholder={`Search ${modalType}...`}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                <FlatList
                  data={filteredData}
                  keyExtractor={(item) => item.isoCode || item.name}
                  renderItem={renderItem}
                  initialNumToRender={15}
                  maxToRenderPerBatch={10}
                  windowSize={5}
                  removeClippedSubviews={true}
                  showsVerticalScrollIndicator={false}
                />
              </MotiView>
            </View>
          </Modal>
        )}
      </AnimatePresence>
    </View>
  );
}
