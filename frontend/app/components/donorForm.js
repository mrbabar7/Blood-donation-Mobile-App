import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  User,
  Calendar,
  Droplet,
  Phone,
  MapPin,
  ChevronRight,
  ArrowLeft,
  X,
  Check,
  Building2,
} from "lucide-react-native";
import { useLocation } from "../../context/LocationContext";
import AppText from "../../components/AppText";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const FormInput = ({
  icon: Icon,
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
}) => (
  <View className="mb-4">
    <AppText
      variant="bold"
      className="text-gray-400 text-[10px] uppercase mb-1.5 ml-1 tracking-widest"
    >
      {label}
    </AppText>
    <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 h-14">
      <Icon size={18} color="#ef4444" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        className="flex-1 ml-3 font-bold text-gray-800"
        placeholderTextColor="#cbd5e1"
      />
    </View>
  </View>
);

export default function RegisterDonor() {
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
    availableProvinces,
    availableCities,
    bloodGroups,
  } = useLocation();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "Male",
    mobileNumber: "",
  });

  const validate = () => {
    if (!formData.fullName.trim()) return "Please enter your full name";
    if (!formData.age || parseInt(formData.age) < 18)
      return "You must be at least 18 years old to donate blood";
    if (!formData.mobileNumber || formData.mobileNumber.length < 11)
      return "Please enter a valid mobile number";
    if (!bloodType) return "Please select your blood group";
    if (!province) return "Please select your province";
    if (!city) return "Please select your city";
    return null;
  };

  const handleRegister = async () => {
    const error = validate();
    if (error) {
      Alert.alert("Validation Error", error);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/donors/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          bloodType,
          province,
          district: city,
        }),
      });

      if (response.ok) {
        Alert.alert("Success! 🎉", "Welcome to the donor community.", [
          { text: "Finish", onPress: () => router.replace("/profile") },
        ]);
      } else {
        const data = await response.json();
        Alert.alert("Error", data.message || "Registration failed");
      }
    } catch (err) {
      Alert.alert("Connection Error", "Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get modal list data and selection action
  const getModalConfig = () => {
    if (modalType === "bloodType") {
      return {
        title: "Select Blood Group",
        data: bloodGroups,
        selectedValue: bloodType,
        onSelect: (item) => {
          setBloodType(item);
          setModalType(null);
        },
      };
    }
    if (modalType === "province") {
      return {
        title: "Select Province",
        data: availableProvinces,
        selectedValue: province,
        onSelect: (item) => {
          setProvince(item);
          setModalType(null);
        },
      };
    }
    if (modalType === "city") {
      return {
        title: province ? `Select City (${province})` : "Select Province First",
        data: availableCities,
        selectedValue: city,
        onSelect: (item) => {
          setCity(item);
          setModalType(null);
        },
      };
    }
    return { title: "", data: [], selectedValue: "", onSelect: () => {} };
  };

  const modalConfig = getModalConfig();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Top Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-4"
        >
          <ArrowLeft size={20} color="#1e293b" />
        </TouchableOpacity>
        <AppText variant="black" className="text-xl text-gray-900">
          Register as Donor
        </AppText>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-6 pt-4"
          contentContainerStyle={{ paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Form Inputs */}
          <FormInput
            label="Full Name"
            icon={User}
            placeholder="Your full name"
            value={formData.fullName}
            onChangeText={(t) => setFormData({ ...formData, fullName: t })}
          />

          <View className="flex-row space-x-3 mb-4">
            <View className="flex-1">
              <FormInput
                label="Age"
                icon={Calendar}
                placeholder="18+"
                keyboardType="numeric"
                value={formData.age}
                onChangeText={(t) => setFormData({ ...formData, age: t })}
              />
            </View>
            <View className="flex-1">
              <AppText
                variant="bold"
                className="text-gray-400 text-[10px] uppercase mb-1.5 ml-1 tracking-widest"
              >
                Gender
              </AppText>
              <View className="flex-row bg-gray-100 p-1 rounded-2xl h-14 items-center">
                {["Male", "Female"].map((g) => (
                  <TouchableOpacity
                    key={g}
                    onPress={() => setFormData({ ...formData, gender: g })}
                    className={`flex-1 h-full items-center justify-center rounded-xl ${
                      formData.gender === g ? "bg-white shadow-sm" : ""
                    }`}
                  >
                    <AppText
                      variant="bold"
                      className={
                        formData.gender === g ? "text-red-600" : "text-gray-400"
                      }
                    >
                      {g}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <FormInput
            label="Mobile Number"
            icon={Phone}
            placeholder="03001234567"
            keyboardType="phone-pad"
            value={formData.mobileNumber}
            onChangeText={(t) => setFormData({ ...formData, mobileNumber: t })}
          />

          {/* Location & Blood Selectors */}
          <View className="bg-gray-50 p-4 rounded-3xl border border-gray-100 mb-6 space-y-3">
            {/* Blood Type Selector */}
            <TouchableOpacity
              onPress={() => setModalType("bloodType")}
              activeOpacity={0.7}
              className="bg-white p-4 rounded-2xl border border-gray-100 flex-row justify-between items-center"
            >
              <View className="flex-row items-center">
                <Droplet size={20} color="#ef4444" />
                <AppText
                  variant="bold"
                  className={`ml-3 ${bloodType ? "text-gray-900" : "text-gray-400"}`}
                >
                  {bloodType || "Select Blood Group"}
                </AppText>
              </View>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>

            {/* Province Selector */}
            <TouchableOpacity
              onPress={() => setModalType("province")}
              activeOpacity={0.7}
              className="bg-white p-4 rounded-2xl border border-gray-100 flex-row justify-between items-center mt-3"
            >
              <View className="flex-row items-center">
                <Building2 size={20} color="#ef4444" />
                <AppText
                  variant="bold"
                  className={`ml-3 ${province ? "text-gray-900" : "text-gray-400"}`}
                >
                  {province || "Select Province"}
                </AppText>
              </View>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>

            {/* City Selector */}
            <TouchableOpacity
              onPress={() => {
                if (!province) {
                  Alert.alert("Notice", "Please select a province first.");
                  return;
                }
                setModalType("city");
              }}
              activeOpacity={0.7}
              className="bg-white p-4 rounded-2xl border border-gray-100 flex-row justify-between items-center mt-3"
            >
              <View className="flex-row items-center">
                <MapPin size={20} color="#ef4444" />
                <AppText
                  variant="bold"
                  className={`ml-3 ${city ? "text-gray-900" : "text-gray-400"}`}
                >
                  {city || "Select City"}
                </AppText>
              </View>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
            className="bg-red-600 h-16 rounded-2xl items-center justify-center shadow-lg shadow-red-200"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <AppText
                variant="black"
                className="text-white uppercase tracking-widest text-base"
              >
                Register Now
              </AppText>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Optimized Bottom Selection Sheet */}
      <Modal
        visible={modalType !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setModalType(null)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalType(null)}
          className="flex-1 bg-black/50 justify-end"
        >
          <TouchableOpacity
            activeOpacity={1}
            className="bg-white rounded-t-[32px] max-h-[60%] px-6 pt-6 pb-8"
          >
            {/* Sheet Header */}
            <View className="flex-row justify-between items-center pb-4 border-b border-gray-100 mb-2">
              <AppText variant="black" className="text-lg text-gray-900">
                {modalConfig.title}
              </AppText>
              <TouchableOpacity
                onPress={() => setModalType(null)}
                className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
              >
                <X size={18} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Virtualized Fast FlatList */}
            <FlatList
              data={modalConfig.data}
              keyExtractor={(item) => item}
              initialNumToRender={12}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = modalConfig.selectedValue === item;
                return (
                  <TouchableOpacity
                    onPress={() => modalConfig.onSelect(item)}
                    className={`py-4 px-3 border-b border-gray-50 flex-row justify-between items-center rounded-xl ${
                      isSelected ? "bg-red-50" : ""
                    }`}
                  >
                    <AppText
                      variant={isSelected ? "bold" : "medium"}
                      className={isSelected ? "text-red-600" : "text-gray-700"}
                    >
                      {item}
                    </AppText>
                    {isSelected && <Check size={18} color="#dc2626" />}
                  </TouchableOpacity>
                );
              }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
