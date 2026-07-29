import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import {
  MapPin,
  Droplet,
  ChevronDown,
  Filter,
  Search,
  Building2,
  HeartHandshake,
  Truck,
  Building,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
} from "lucide-react-native";
import { AnimatePresence } from "moti";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AppText from "../../components/AppText";
import SelectionModal from "../../components/SelectionModal";
import DonorCard from "../components/DonorCard";
import { useLocation } from "../../context/LocationContext";
import {
  PAKISTAN_LOCATIONS,
  BLOOD_GROUPS,
} from "../../constants/pakistanLocations";

// Quick Services Options
const QUICK_SERVICES = [
  {
    id: "hospitals",
    title: "Hospitals",
    icon: Building2,
    route: "/(registration)/hospitals",
    bgColor: "bg-blue-500/10",
    iconColor: "#2563eb",
  },
  {
    id: "blood-banks",
    title: "Blood Banks",
    icon: Building,
    route: "/(registration)/blood-banks",
    bgColor: "bg-red-500/10",
    iconColor: "#dc2626",
  },
  {
    id: "ngos",
    title: "NGOs",
    icon: HeartHandshake,
    route: "/(registration)/ngos",
    bgColor: "bg-emerald-500/10",
    iconColor: "#059669",
  },
  {
    id: "ambulance",
    title: "Ambulance",
    icon: Truck,
    route: "/(registration)/ambulance",
    bgColor: "bg-amber-500/10",
    iconColor: "#d97706",
  },
];

export default function SeekerInterface() {
  const router = useRouter();
  const {
    province,
    setProvince,
    city,
    setCity,
    bloodType,
    setBloodType,
    modalType,
    setModalType,
  } = useLocation();

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestingId, setRequestingId] = useState(null);
  const [cancelLoadingId, setCancelLoadingId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  // Custom Modal State for replacing Alert.alert
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info", // "success" | "error" | "info"
  });

  const showPopup = (title, message, type = "info") => {
    setFeedbackModal({ visible: true, title, message, type });
  };

  const hidePopup = () => {
    setFeedbackModal((prev) => ({ ...prev, visible: false }));
  };

  const isSearchDisabled = !province || !city || !bloodType;

  // Location selection lists derived from constants
  const availableProvinces = Object.keys(PAKISTAN_LOCATIONS || {});
  const availableCities =
    province && PAKISTAN_LOCATIONS[province]
      ? PAKISTAN_LOCATIONS[province]
      : [];

  const calculateDaysLeft = (targetDate) => {
    if (!targetDate) return 0;
    const diff = new Date(targetDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const fetchDonors = async () => {
    if (!province || !bloodType) return;
    setLoading(true);
    try {
      const query = new URLSearchParams({
        province,
        district: city,
        bloodType,
      }).toString();

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/seeker/search?${query}`,
      );
      console.log("donor fetchinf response :", response);
      const data = await response.json();
      if (response.ok) {
        setDonors(data);
      }
    } catch (err) {
      showPopup("Search Failed", "Unable to fetch donors right now.", "error");
    } finally {
      setLoading(false);
    }
  };

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
      console.log("fuck result:", result);
      if (response.ok) {
        showPopup(
          "Request Sent",
          "Your request has been sent to the donor.",
          "success",
        );
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
      } else {
        showPopup(
          "Error",
          result?.message || "Failed to send request.",
          "error",
        );
      }
    } catch (err) {
      showPopup(
        "Error",
        "Failed to send request. Check your internet connection.",
        "error",
      );
    } finally {
      setRequestingId(null);
    }
  };

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
        showPopup("Cancelled", "Your blood request was cancelled.", "info");
        setDonors((prev) =>
          prev.map((d) =>
            d._id === donorId ? { ...d, requestStatus: null } : d,
          ),
        );
      } else {
        showPopup("Error", "Failed to cancel request.", "error");
      }
    } catch (err) {
      showPopup("Error", "Failed to cancel request.", "error");
    } finally {
      setCancelLoadingId(null);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View className="px-4 pt-4 space-y-4">
          {/* --- 1. SINGLE HORIZONTAL PARENT CARD FOR SERVICES --- */}
          <View className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10, paddingRight: 4 }}
            >
              {QUICK_SERVICES.map((item) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.75}
                    onPress={() => router.push(item.route)}
                    className="flex-row items-center bg-slate-50/80 border border-slate-100 px-3.5 py-2.5 rounded-2xl"
                  >
                    <View
                      className={`w-9 h-9 rounded-xl ${item.bgColor} items-center justify-center mr-2.5`}
                    >
                      <IconComponent size={18} color={item.iconColor} />
                    </View>
                    <AppText
                      variant="bold"
                      className="text-slate-800 text-xs tracking-tight pr-1"
                    >
                      {item.title}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* --- 2. SEARCH SELECTION SECTION --- */}
          <View className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            {/* Centered Professional Header */}
            <View className="items-center mb-5">
              <AppText
                variant="black"
                className="text-slate-900 text-lg uppercase tracking-wide text-center"
              >
                Search for Donors
              </AppText>
              <AppText
                variant="medium"
                className="text-slate-400 text-xs text-center mt-0.5"
              >
                Find available blood donors in your area
              </AppText>
            </View>

            {/* Selection Fields Container */}
            <View className="space-y-3">
              {/* Province Field Selector */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setModalType("province")}
                className="flex-row items-center bg-slate-50/80 border border-red-700 rounded-[30px] h-14 px-4 mb-2"
              >
                <View className="w-8 items-center justify-center">
                  <Filter size={18} color={province ? "#dc2626" : "#94a3b8"} />
                </View>
                <AppText
                  variant="bold"
                  className={`flex-1 ml-2 text-sm ${
                    province ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {province || "Select Province"}
                </AppText>
                <ChevronDown size={18} color="#94a3b8" />
              </TouchableOpacity>

              {/* City Field Selector */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  if (!province) {
                    showPopup(
                      "Selection Required",
                      "Please choose a province before selecting a city.",
                      "info",
                    );
                    return;
                  }
                  setModalType("city");
                }}
                className={`flex-row items-center bg-slate-50/80 border  border-red-700 rounded-[30px] h-14 px-4 mb-2 ${
                  !province ? "opacity-50" : ""
                }`}
              >
                <View className="w-8 items-center justify-center">
                  <MapPin size={18} color={city ? "#dc2626" : "#94a3b8"} />
                </View>
                <AppText
                  variant="bold"
                  className={`flex-1 ml-2 text-sm ${
                    city ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {city || (province ? "Select City" : "Select Province First")}
                </AppText>
                <ChevronDown size={18} color="#94a3b8" />
              </TouchableOpacity>

              {/* Blood Type Field Selector */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setModalType("bloodType")}
                className="flex-row items-center bg-slate-50/80 border  border-red-700 rounded-[30px] h-14 px-4 mb-2"
              >
                <View className="w-8 items-center justify-center">
                  <Droplet
                    size={18}
                    color={bloodType ? "#dc2626" : "#94a3b8"}
                    fill={bloodType ? "#dc2626" : "transparent"}
                  />
                </View>
                <AppText
                  variant="bold"
                  className={`flex-1 ml-2 text-sm ${
                    bloodType ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {bloodType || "Select Blood Group"}
                </AppText>
                <ChevronDown size={18} color="#94a3b8" />
              </TouchableOpacity>

              {/* Find Donors Action Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={fetchDonors}
                disabled={isSearchDisabled || loading}
                className={`h-14  flex-row rounded-[30px] items-center justify-center mt-2 shadow-md ${
                  isSearchDisabled
                    ? "bg-slate-300 shadow-none"
                    : "bg-red-800 shadow-red-200"
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Search size={18} color="white" />
                    <AppText
                      variant="black"
                      className="text-white ml-2 text-sm uppercase tracking-wider"
                    >
                      Find Donors
                    </AppText>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* --- DONORS RESULTS CONTENT AREA --- */}
        <View className="px-4 mt-4">
          <AnimatePresence>
            {donors.length > 0 ? (
              donors
                .slice(0, visibleCount)
                .map((donor) => (
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
              <View className="items-center justify-center py-12 bg-white rounded-3xl border border-slate-100 p-6">
                <View className="w-14 h-14 bg-red-50 rounded-full items-center justify-center mb-3">
                  <Droplet size={24} color="#dc2626" fill="#dc2626" />
                </View>
                <AppText
                  variant="black"
                  className="text-slate-800 text-sm uppercase tracking-wider text-center"
                >
                  Search Emergency Donors
                </AppText>
                <AppText
                  variant="medium"
                  className="text-slate-400 text-xs text-center mt-1 max-w-[240px]"
                >
                  Select location and blood group filters above to locate active
                  donors nearby.
                </AppText>
              </View>
            )}
          </AnimatePresence>

          {donors.length > visibleCount && (
            <TouchableOpacity
              onPress={() => setVisibleCount((prev) => prev + 6)}
              activeOpacity={0.85}
              className="bg-slate-900 h-14 rounded-2xl items-center justify-center mt-2 shadow-sm"
            >
              <AppText
                variant="black"
                className="text-white text-xs uppercase tracking-wider"
              >
                Load More Donors
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* --- SELECTION MODALS --- */}
      <SelectionModal
        visible={modalType === "province"}
        title="Select Province"
        data={availableProvinces}
        selectedValue={province}
        onSelect={(val) => {
          setProvince(val);
          setCity(""); // Reset city when province changes
          setModalType(null);
        }}
        onClose={() => setModalType(null)}
      />

      <SelectionModal
        visible={modalType === "city"}
        title={`Select City (${province || ""})`}
        data={availableCities}
        selectedValue={city}
        onSelect={(val) => {
          setCity(val);
          setModalType(null);
        }}
        onClose={() => setModalType(null)}
      />

      <SelectionModal
        visible={modalType === "bloodType"}
        title="Select Blood Group"
        data={BLOOD_GROUPS}
        selectedValue={bloodType}
        onSelect={(val) => {
          setBloodType(val);
          setModalType(null);
        }}
        onClose={() => setModalType(null)}
      />

      {/* --- 3. PROFESSIONAL REUSABLE POPUP MODAL --- */}
      <Modal
        visible={feedbackModal.visible}
        transparent
        animationType="fade"
        onRequestClose={hidePopup}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white w-full rounded-3xl p-6 items-center shadow-xl">
            <TouchableOpacity
              onPress={hidePopup}
              className="absolute top-4 right-4 p-1 rounded-full bg-slate-100"
            >
              <X size={16} color="#64748b" />
            </TouchableOpacity>

            {/* Modal Icon Badge */}
            <View
              className={`w-14 h-14 rounded-full items-center justify-center mb-4 ${
                feedbackModal.type === "success"
                  ? "bg-emerald-100"
                  : feedbackModal.type === "error"
                    ? "bg-red-100"
                    : "bg-blue-100"
              }`}
            >
              {feedbackModal.type === "success" && (
                <CheckCircle2 size={28} color="#059669" />
              )}
              {feedbackModal.type === "error" && (
                <XCircle size={28} color="#dc2626" />
              )}
              {feedbackModal.type === "info" && (
                <AlertCircle size={28} color="#2563eb" />
              )}
            </View>

            {/* Modal Title */}
            <AppText
              variant="black"
              className="text-slate-900 text-lg text-center"
            >
              {feedbackModal.title}
            </AppText>

            {/* Modal Description */}
            <AppText
              variant="medium"
              className="text-slate-500 text-xs text-center mt-2 leading-relaxed px-2"
            >
              {feedbackModal.message}
            </AppText>

            {/* Close Button */}
            <TouchableOpacity
              onPress={hidePopup}
              activeOpacity={0.8}
              className="w-full bg-slate-900 h-12 rounded-2xl items-center justify-center mt-6"
            >
              <AppText
                variant="bold"
                className="text-white text-xs uppercase tracking-wider"
              >
                Dismiss
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
