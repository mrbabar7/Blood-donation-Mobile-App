import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
  TextInput,
  ActivityIndicator,
  Modal,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  User,
  Calendar,
  Droplet,
  Phone,
  MapPin,
  ChevronRight,
  Building2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react-native";

import AppText from "../../components/AppText";
import SelectionModal from "../../components/SelectionModal";
import { useDonor } from "../../context/DonorContext";
import {
  PAKISTAN_LOCATIONS,
  BLOOD_GROUPS,
} from "../../constants/pakistanLocations";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const FormInput = ({
  icon: Icon,
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  error = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      <AppText
        variant="bold"
        className="text-gray-700 text-[11px] font-semibold uppercase mb-1.5 ml-1 tracking-wider"
      >
        {label}
      </AppText>
      <View
        className={`flex-row items-center bg-gray-50/80 border rounded-[30px] px-4 h-14 ${
          error
            ? "border-red-500 bg-red-50/10"
            : isFocused
              ? "border-red-500 bg-white"
              : "border-gray-200"
        }`}
      >
        <Icon
          size={18}
          color={error ? "#ef4444" : isFocused ? "#dc2626" : "#94a3b8"}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 ml-3 font-semibold text-gray-900 text-base"
          placeholderTextColor="#94a3b8"
        />
      </View>
      {!!error && (
        <AppText variant="medium" className="text-red-700 text-xs mt-1 ml-1">
          {error}
        </AppText>
      )}
    </View>
  );
};

export default function DonorRegistration() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const from = params?.from;
  const { registerDonor } = useDonor();

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "Male",
    mobileNumber: "",
    bloodType: "",
    province: "",
    city: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    type: "success",
    title: "",
    message: "",
  });

  const availableProvinces = Object.keys(PAKISTAN_LOCATIONS);
  const availableCities = formData.province
    ? PAKISTAN_LOCATIONS[formData.province] || []
    : [];

  const validateForm = () => {
    let newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (parseInt(formData.age, 10) < 18) {
      newErrors.age = "Must be 18+ to donate";
    }

    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (formData.mobileNumber.length < 11) {
      newErrors.mobileNumber = "Enter a valid 11-digit number";
    }

    if (!formData.bloodType) {
      newErrors.bloodType = "Please select your blood group";
    }

    if (!formData.province) {
      newErrors.province = "Please select your province";
    }

    if (!formData.city) {
      newErrors.city = "Please select your city";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (prev[field]) {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      }
      return prev;
    });
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/donors/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          age: formData.age,
          gender: formData.gender,
          mobileNumber: formData.mobileNumber,
          bloodType: formData.bloodType,
          province: formData.province,
          district: formData.city,
        }),
      });

      if (response.ok) {
        registerDonor(formData);
        setFeedbackModal({
          visible: true,
          type: "success",
          title: "Welcome to the Hero Network!",
          message:
            "Your donor profile is active and ready to save lives in your area.",
        });
      } else {
        const data = await response.json();
        setFeedbackModal({
          visible: true,
          type: "error",
          title: "Registration Failed",
          message:
            data.message ||
            "Unable to register your profile. Please check your details and try again.",
        });
      }
    } catch (err) {
      setFeedbackModal({
        visible: true,
        type: "error",
        title: "Connection Error",
        message:
          "Network request failed. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessRedirect = () => {
    setFeedbackModal((prev) => ({ ...prev, visible: false }));
    if (from === "index") {
      router.replace("/(dashboard)");
    } else {
      router.replace("/(dashboard)/profile");
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-5 pt-5"
        contentContainerStyle={{ paddingBottom: 50 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Banner Hero */}
        <View className="bg-slate-200 rounded-3xl p-5 mb-6 shadow-md shadow-red-200 overflow-hidden relative">
          <View className="flex-row items-center mb-1">
            <Sparkles size={16} color="#fca5a5" />
            <AppText
              variant="bold"
              className="text-xs uppercase tracking-widest ml-1.5"
            >
              Save Lives Nearby
            </AppText>
          </View>
          <Text className="text-2xl text-red-700 font-semibold mb-1">
            Become a Hero 🩸
          </Text>
          <AppText variant="medium" className="text-red-700 text-xs leading-5">
            Registering takes less than a minute and puts you on the frontline
            to save lives during urgent needs.
          </AppText>
        </View>

        {/* Form Section Container */}
        <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm mb-6 space-y-1">
          <FormInput
            label="Full Name"
            icon={User}
            placeholder="e.g. John Doe"
            value={formData.fullName}
            onChangeText={(t) => handleFieldChange("fullName", t)}
            error={errors.fullName}
          />

          <View className="flex-row justify-between gap-4 mb-4">
            <View className="flex-1">
              <FormInput
                label="Age"
                icon={Calendar}
                placeholder="18+"
                keyboardType="numeric"
                value={formData.age}
                onChangeText={(t) => handleFieldChange("age", t)}
                error={errors.age}
              />
            </View>

            <View className="flex-1">
              <AppText
                variant="bold"
                className="text-gray-500 text-[11px] uppercase mb-1.5 ml-1 tracking-wider"
              >
                Gender
              </AppText>
              <View className="flex-row bg-slate-100 p-1.5 rounded-[30px] h-14 items-center">
                {["Male", "Female"].map((g) => {
                  const isSelected = formData.gender === g;
                  return (
                    <Pressable
                      key={g}
                      onPress={() => handleFieldChange("gender", g)}
                      className={`flex-1 h-full items-center justify-center rounded-[30px] ${
                        isSelected ? "bg-white shadow-sm" : ""
                      }`}
                    >
                      <Text
                        className={`font-bold text-sm ${
                          isSelected ? "text-red-600" : "text-slate-500"
                        }`}
                      >
                        {g}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          <FormInput
            label="Mobile Number"
            icon={Phone}
            placeholder="03001234567"
            keyboardType="phone-pad"
            value={formData.mobileNumber}
            onChangeText={(t) => handleFieldChange("mobileNumber", t)}
            error={errors.mobileNumber}
          />

          {/* Dropdown Selectors */}
          <View className="pt-2 border-t border-slate-100 space-y-3 mt-2">
            {/* Blood Group Dropdown */}
            <View>
              <AppText
                variant="bold"
                className="text-gray-500 text-[11px] uppercase mb-1.5 ml-1 tracking-wider"
              >
                Blood Group
              </AppText>
              <TouchableOpacity
                onPress={() => setActiveModal("bloodType")}
                activeOpacity={0.7}
                className={`bg-slate-50/80 p-4 rounded-[30px] border flex-row justify-between items-center h-14 ${
                  errors.bloodType
                    ? "border-red-500 bg-red-50/10"
                    : "border-slate-200"
                }`}
              >
                <View className="flex-row items-center">
                  <Droplet size={18} color="#ef4444" />
                  <AppText
                    variant="bold"
                    className={`ml-3 text-base ${
                      formData.bloodType ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {formData.bloodType || "Select Blood Group"}
                  </AppText>
                </View>
                <ChevronRight size={18} color="#94a3b8" />
              </TouchableOpacity>
              {!!errors.bloodType && (
                <AppText
                  variant="medium"
                  className="text-red-500 text-xs mt-1 ml-1"
                >
                  {errors.bloodType}
                </AppText>
              )}
            </View>

            {/* Province Dropdown */}
            <View className="mt-3">
              <AppText
                variant="bold"
                className="text-gray-500 text-[11px] uppercase mb-1.5 ml-1 tracking-wider"
              >
                Province
              </AppText>
              <TouchableOpacity
                onPress={() => setActiveModal("province")}
                activeOpacity={0.7}
                className={`bg-slate-50/80 p-4 rounded-[30px] border flex-row justify-between items-center h-14 ${
                  errors.province
                    ? "border-red-500 bg-red-50/10"
                    : "border-slate-200"
                }`}
              >
                <View className="flex-row items-center">
                  <Building2 size={18} color="#ef4444" />
                  <AppText
                    variant="bold"
                    className={`ml-3 text-base ${
                      formData.province ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {formData.province || "Select Province"}
                  </AppText>
                </View>
                <ChevronRight size={18} color="#94a3b8" />
              </TouchableOpacity>
              {!!errors.province && (
                <AppText
                  variant="medium"
                  className="text-red-500 text-xs mt-1 ml-1"
                >
                  {errors.province}
                </AppText>
              )}
            </View>

            {/* City Dropdown */}
            <View className="mt-3">
              <AppText
                variant="bold"
                className="text-gray-500 text-[11px] uppercase mb-1.5 ml-1 tracking-wider"
              >
                City
              </AppText>
              <TouchableOpacity
                onPress={() => {
                  if (!formData.province) {
                    setErrors((prev) => ({
                      ...prev,
                      province: "Please select a province first",
                    }));
                    return;
                  }
                  setActiveModal("city");
                }}
                activeOpacity={0.7}
                className={`bg-slate-50/80 p-4 rounded-[30px] border flex-row justify-between items-center h-14 ${
                  errors.city
                    ? "border-red-500 bg-red-50/10"
                    : "border-slate-200"
                }`}
              >
                <View className="flex-row items-center">
                  <MapPin size={18} color="#ef4444" />
                  <AppText
                    variant="bold"
                    className={`ml-3 text-base ${
                      formData.city ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {formData.city || "Select City"}
                  </AppText>
                </View>
                <ChevronRight size={18} color="#94a3b8" />
              </TouchableOpacity>
              {!!errors.city && (
                <AppText
                  variant="medium"
                  className="text-red-500 text-xs mt-1 ml-1"
                >
                  {errors.city}
                </AppText>
              )}
            </View>
          </View>
        </View>

        {/* Submit Action */}
        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.85}
          className="rounded-[30px] overflow-hidden shadow-lg shadow-red-300/50 items-center justify-center h-14 mb-10"
        >
          <LinearGradient
            colors={["#dc2626", "#991b1b"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-full h-full flex-row items-center justify-center px-6"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <AppText
                variant="black"
                className="text-white uppercase tracking-widest text-base"
              >
                Register as Donor
              </AppText>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Selection Modals */}
      <SelectionModal
        visible={activeModal === "bloodType"}
        title="Select Blood Group"
        data={BLOOD_GROUPS}
        selectedValue={formData.bloodType}
        onSelect={(val) => {
          handleFieldChange("bloodType", val);
          setActiveModal(null);
        }}
        onClose={() => setActiveModal(null)}
      />

      <SelectionModal
        visible={activeModal === "province"}
        title="Select Province"
        data={availableProvinces}
        selectedValue={formData.province}
        onSelect={(val) => {
          handleFieldChange("province", val);
          handleFieldChange("city", "");
          setActiveModal(null);
        }}
        onClose={() => setActiveModal(null)}
      />

      <SelectionModal
        visible={activeModal === "city"}
        title={`Select City (${formData.province})`}
        data={availableCities}
        selectedValue={formData.city}
        onSelect={(val) => {
          handleFieldChange("city", val);
          setActiveModal(null);
        }}
        onClose={() => setActiveModal(null)}
      />

      {/* HTTP Error & Success Modal */}
      <Modal visible={feedbackModal.visible} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm items-center shadow-2xl">
            {feedbackModal.type === "success" ? (
              <View className="w-16 h-16 rounded-full bg-emerald-100 items-center justify-center mb-2">
                <CheckCircle2 size={38} color="#059669" />
              </View>
            ) : (
              <View className="w-16 h-16 rounded-full bg-red-100 items-center justify-center mb-2">
                <AlertCircle size={38} color="#dc2626" />
              </View>
            )}

            <AppText
              variant="black"
              className="text-xl text-slate-900 mt-2 text-center"
            >
              {feedbackModal.title}
            </AppText>
            <AppText
              variant="medium"
              className="text-slate-500 text-center mt-2 text-sm leading-5"
            >
              {feedbackModal.message}
            </AppText>

            <TouchableOpacity
              onPress={() => {
                if (feedbackModal.type === "success") {
                  handleSuccessRedirect();
                } else {
                  setFeedbackModal((prev) => ({ ...prev, visible: false }));
                }
              }}
              className={`w-full h-14 rounded-2xl items-center justify-center mt-6 ${
                feedbackModal.type === "success"
                  ? "bg-emerald-600"
                  : "bg-red-600"
              }`}
            >
              <AppText variant="bold" className="text-white text-base">
                {feedbackModal.type === "success" ? "Continue" : "Try Again"}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
