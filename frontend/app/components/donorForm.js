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
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import {
  User,
  Calendar,
  Droplet,
  Phone,
  MapPin,
  ChevronRight,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react-native";
import { useLocation } from "../../context/LocationContext";
import { MotiView } from "moti";
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
  <View className="mb-5">
    <AppText
      variant="bold"
      className="text-gray-400 text-[10px] uppercase mb-2 ml-1 tracking-widest"
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
  const { province, city, bloodType, setModalType } = useLocation();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "Male",
    mobileNumber: "",
  });

  const handleRegister = async () => {
    const error = validate();
    if (error) {
      Alert.alert("Required", error);
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

  return (
    // z-50 and bg-white ensures this screen sits ON TOP of the TabBar
    <View className="flex-1 bg-white z-50">
      <StatusBar barStyle="dark-content" />

      {/* Header Bar */}
      <View className="px-6 pt-12 pb-4 flex-row items-center justify-between border-b border-gray-50">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
        >
          <ArrowLeft size={20} color="#1e293b" />
        </TouchableOpacity>
        <AppText
          variant="black"
          className="text-gray-900 uppercase tracking-widest text-[10px]"
        >
          Donor Registration
        </AppText>
        <View className="w-10" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 60 }}
          keyboardShouldPersistTaps="always"
        >
          {/* Form Fields */}
          <FormInput
            label="Full Name"
            icon={User}
            placeholder="Your name"
            value={formData.fullName}
            onChangeText={(t) => setFormData({ ...formData, fullName: t })}
          />

          <View className="flex-row space-x-4 mb-5">
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
                className="text-gray-400 text-[10px] uppercase mb-2 ml-1 tracking-widest"
              >
                Gender
              </AppText>
              <View className="flex-row bg-gray-100 p-1 rounded-2xl h-14">
                {["Male", "Female"].map((g) => (
                  <TouchableOpacity
                    key={g}
                    onPress={() => setFormData({ ...formData, gender: g })}
                    className={`flex-1 items-center justify-center rounded-xl ${formData.gender === g ? "bg-white shadow-sm" : ""}`}
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
            placeholder="03XXXXXXXXX"
            keyboardType="phone-pad"
            value={formData.mobileNumber}
            onChangeText={(t) => setFormData({ ...formData, mobileNumber: t })}
          />

          {/* Custom Selectors for Blood/City */}
          <View className="bg-gray-50 p-5 rounded-[30px] border border-gray-100 mb-8">
            <TouchableOpacity
              onPress={() => setModalType("bloodType")}
              className="mb-4 bg-white p-4 rounded-2xl border border-gray-100 flex-row justify-between items-center"
            >
              <View className="flex-row items-center">
                <Droplet size={18} color="#ef4444" />
                <AppText variant="bold" className="ml-3 text-gray-800">
                  {bloodType || "Blood Group"}
                </AppText>
              </View>
              <ChevronRight size={16} color="#cbd5e1" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalType("city")}
              className="bg-white p-4 rounded-2xl border border-gray-100 flex-row justify-between items-center"
            >
              <View className="flex-row items-center">
                <MapPin size={18} color="#ef4444" />
                <AppText variant="bold" className="ml-3 text-gray-800">
                  {city || "Select City"}
                </AppText>
              </View>
              <ChevronRight size={16} color="#cbd5e1" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="bg-red-600 h-16 rounded-2xl items-center justify-center shadow-lg shadow-red-200"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <AppText
                variant="black"
                className="text-white uppercase tracking-widest"
              >
                Register Now
              </AppText>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
