import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import {
  MapPin,
  Phone,
  X,
  Droplet,
  Check,
  Clock,
  ChevronDown,
  Filter,
  ExternalLink,
  Search,
} from "lucide-react-native";
import { useLocation } from "../../context/LocationContext"; // Using your custom location hook
import { MotiView, AnimatePresence } from "moti";
import AppText from "../../components/AppText";
import { useRouter } from "expo-router";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function SeekerInterface() {
  const router = useRouter();
  const {
    province,
    setProvince,
    city,
    setCity,
    bloodType,
    setBloodType,
    setModalType,
  } = useLocation();

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestingId, setRequestingId] = useState(null);
  const [cancelLoadingId, setCancelLoadingId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  const isSearchDisabled = !province || !city || !bloodType;

  // Ported Web Logic: Calculate Days Left for Recovery
  const calculateDaysLeft = (targetDate) => {
    if (!targetDate) return 0;
    const diff = new Date(targetDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  // Ported Web Logic: Fetch Donors
  const fetchDonors = async () => {
    if (!province || !bloodType) return;
    console.log("Fetching donors with:", { province, city, bloodType });
    setLoading(true);
    try {
      const query = new URLSearchParams({
        province: province,
        district: city,
        bloodType: bloodType,
      }).toString();

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/seeker/search?${query}`,
      );
      const data = await response.json();
      console.log("Search Results:", data);
      if (response.ok) {
        setDonors(data);
      }
    } catch (err) {
      console.error("Search Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Ported Web Logic: Send Request
  const handleRequestBlood = async (donorId, bType) => {
    setRequestingId(donorId);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/seeker/send-request/${donorId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestedBloodType: bType }),
        },
      );
      const result = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Request Sent Successfully!");
        setDonors((prev) =>
          prev.map((d) =>
            d._id === donorId
              ? {
                  ...d,
                  requestStatus: "pending",
                  requestId: result.request?._id,
                }
              : d,
          ),
        );
      }
    } catch (err) {
      Alert.alert("Error", "Failed to send request");
    } finally {
      setRequestingId(null);
    }
  };

  // Ported Web Logic: Cancel Request
  const handleCancelRequest = async (donorId) => {
    setCancelLoadingId(donorId);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/seeker/cancel-request/${donorId}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        Alert.alert("Success", "Request Cancelled");
        setDonors((prev) =>
          prev.map((d) =>
            d._id === donorId ? { ...d, requestStatus: null } : d,
          ),
        );
      }
    } catch (err) {
      Alert.alert("Error", "Failed to cancel request");
    } finally {
      setCancelLoadingId(null);
    }
  };

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-5 pt-6 space-y-3">
          {/* Province Selector (Style matched to Web) */}
          <TouchableOpacity
            onPress={() => setModalType("province")}
            className="flex-row items-center bg-white border border-gray-200 rounded-2xl h-[56px] px-4 shadow-sm"
          >
            <Filter size={18} color={province ? "#ef4444" : "#94a3b8"} />
            <AppText className="flex-1 ml-3 text-gray-700 font-bold text-sm">
              {province || "Select Province"}
            </AppText>
            <ChevronDown size={16} color="#94a3b8" />
          </TouchableOpacity>

          {/* City Selector */}
          <TouchableOpacity
            onPress={() => setModalType("city")}
            disabled={!province}
            className={`flex-row items-center bg-white border border-gray-200 my-1.5 rounded-2xl h-[56px] px-4 shadow-sm ${!province && "opacity-50"}`}
          >
            <MapPin size={18} color={city ? "#ef4444" : "#94a3b8"} />
            <AppText className="flex-1 ml-3 text-gray-700 font-bold text-sm">
              {city || (province ? "Select City" : "Select City First")}
            </AppText>
            <ChevronDown size={16} color="#94a3b8" />
          </TouchableOpacity>

          {/* Blood Group Selector (Professional Select Style) */}
          <TouchableOpacity
            onPress={() => setModalType("bloodType")} // Trigger your custom blood type picker
            className="flex-row items-center bg-white border border-gray-200 rounded-2xl h-[56px] px-4 shadow-sm"
          >
            <Droplet size={18} color="#ef4444" fill="#ef4444" />
            <AppText className="flex-1 ml-3 text-gray-700 font-bold text-sm">
              {bloodType || "Select Blood Group"}
            </AppText>
            <ChevronDown size={16} color="#94a3b8" />
          </TouchableOpacity>

          {/* Search Button */}
          <TouchableOpacity
            onPress={fetchDonors}
            disabled={isSearchDisabled || loading}
            className={`h-[56px] rounded-2xl flex-row items-center justify-center mt-2 shadow-lg ${
              isSearchDisabled ? "bg-gray-700" : "bg-red-600 shadow-red-200"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Search size={18} color="white" />
                <AppText variant="bold" className="text-white ml-2 text-base">
                  Find Donors
                </AppText>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* --- MAIN CONTENT AREA --- */}
        <View className="px-5 mt-6 border-t border-gray-100 pt-6">
          <AnimatePresence>
            {donors.length > 0 ? (
              donors
                .slice(0, visibleCount)
                .map((donor, index) => (
                  <DonorCard
                    key={donor._id}
                    donor={donor}
                    daysLeft={calculateDaysLeft(donor.nextAvailableDate)}
                    onRequest={() =>
                      handleRequestBlood(donor._id, donor.bloodType)
                    }
                    onCancel={() => handleCancelRequest(donor._id)}
                    isRequesting={requestingId === donor._id}
                    cancelLoading={cancelLoadingId === donor._id}
                    onDetails={() =>
                      router.push(
                        `/dashboard/donor-details/${donor._id}/${donor.requestId}`,
                      )
                    }
                  />
                ))
            ) : (
              <View className="items-center justify-center py-20">
                <Droplet size={40} color="#ef4444" className="mb-4" />
                <AppText className="text-red-500 font-black text-[10px] tracking-widest text-center uppercase">
                  Select filters and click Find to search Blood
                </AppText>
              </View>
            )}
          </AnimatePresence>

          {donors.length > visibleCount && (
            <TouchableOpacity
              onPress={() => setVisibleCount((prev) => prev + 6)}
              className="bg-red-600 h-14 rounded-2xl items-center justify-center mt-4 shadow-lg shadow-red-200"
            >
              <AppText variant="bold" className="text-white">
                Load More Donors
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const DonorCard = ({
  donor,
  daysLeft,
  onRequest,
  onCancel,
  isRequesting,
  cancelLoading,
  onDetails,
}) => {
  const isLocked = daysLeft > 0;

  return (
    <MotiView
      from={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] p-6 mb-4 border border-gray-100 shadow-sm"
    >
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1">
          <View
            className={`px-3 py-1 rounded-full self-start mb-2 ${
              isLocked
                ? "bg-red-50"
                : donor.isAvailable
                  ? "bg-emerald-50"
                  : "bg-gray-100"
            }`}
          >
            <AppText
              className={`text-[9px] font-black  tracking-wider ${
                isLocked
                  ? "text-red-700"
                  : donor.isAvailable
                    ? "text-emerald-600"
                    : "text-gray-500"
              }`}
            >
              ●{" "}
              {isLocked
                ? `Recovering (${daysLeft}d)`
                : donor.isAvailable
                  ? "Available"
                  : "Busy"}
            </AppText>
          </View>
          <AppText variant="bold" className="font-bold text-lg leading-tight">
            {donor.fullName}
          </AppText>
          <View className="flex-row items-center mt-1">
            <MapPin size={12} color="#f87171" />
            <AppText className="text-xs font-bold ml-1">
              {donor.district}
            </AppText>
          </View>
        </View>

        <View className="w-14 h-14 bg-red-600 rounded-2xl items-center justify-center shadow-md shadow-red-200">
          <AppText variant="bold" className="text-white font-bold text-xl">
            {donor.bloodType}
          </AppText>
        </View>
      </View>

      <View className="flex-row bg-gray-50 rounded-2xl p-4 mb-5 justify-between">
        <View>
          <AppText className="text-[9px] font-black text-gray-400 uppercase">
            Lives Saved
          </AppText>
          <AppText variant="bold" className="text-gray-700 text-xs">
            {donor.livesSaved || 0} Times
          </AppText>
        </View>
        <View>
          <AppText className="text-[9px] font-black text-gray-400 uppercase">
            Age
          </AppText>
          <AppText variant="bold" className="text-gray-700 text-xs">
            {donor.age} Years
          </AppText>
        </View>
      </View>

      {/* Button Logic exactly from Web */}
      {donor.requestStatus === "pending" ? (
        <View className="flex-row gap-2">
          <View className="flex-[2] bg-amber-500 h-12 rounded-xl flex-row items-center justify-center">
            <Clock size={14} color="white" />
            <AppText
              variant="bold"
              className="text-white text-[10px] ml-2 uppercase"
            >
              Pending
            </AppText>
          </View>
          <TouchableOpacity
            onPress={onCancel}
            className="flex-1 bg-red-50 border border-red-100 h-12 rounded-xl items-center justify-center"
          >
            {cancelLoading ? (
              <ActivityIndicator size="small" color="#ef4444" />
            ) : (
              <AppText
                variant="bold"
                className="text-red-600 text-[10px] uppercase"
              >
                Cancel
              </AppText>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row gap-2">
          <TouchableOpacity
            disabled={isLocked || !donor.isAvailable || isRequesting}
            onPress={onRequest}
            className={`flex-1 h-12 rounded-xl flex-row items-center justify-center ${
              isLocked || !donor.isAvailable
                ? "bg-gray-300"
                : donor.requestStatus === "accepted"
                  ? "bg-emerald-500"
                  : "bg-red-600"
            }`}
          >
            {isRequesting ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                {donor.requestStatus === "accepted" ? (
                  <Check size={14} color="white" />
                ) : (
                  <Phone size={14} color="white" fill="white" />
                )}
                <AppText
                  variant="bold"
                  className="text-white text-[10px] ml-2 uppercase"
                >
                  {isLocked
                    ? `Locked (${daysLeft}d)`
                    : donor.requestStatus === "accepted"
                      ? "Accepted"
                      : "Request Blood"}
                </AppText>
              </>
            )}
          </TouchableOpacity>

          {donor.requestStatus === "accepted" && (
            <TouchableOpacity
              onPress={onDetails}
              className="flex-1 bg-black h-12 rounded-xl flex-row items-center justify-center"
            >
              <ExternalLink size={14} color="white" />
              <AppText
                variant="bold"
                className="text-white text-[10px] ml-2 uppercase"
              >
                Details
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      )}
    </MotiView>
  );
};
