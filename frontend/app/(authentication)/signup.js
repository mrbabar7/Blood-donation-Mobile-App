import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  UserCheck,
} from "lucide-react-native";
import FloatingLabelInput from "../components/ui/FloatingLabelInput";
import GradientButton from "../components/ui/GradientButton";
import StatusModal from "../components/ui/StatusModal";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import AppText from "../../components/AppText";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function SignUp() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Status Modal State
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    type: "error",
    title: "",
    message: "",
  });

  const closeModal = () => setModalConfig({ ...modalConfig, visible: false });

  // Input Validation Logic
  const validateForm = () => {
    let newErrors = {};

    // 1. Full Name check (at least 3 characters)
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // 2. Strict Email check ending in valid domains like .com, .pk, etc.
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email ending in .com, .pk, etc.";
    }

    // 3. Password check (at least 6 characters)
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Endpoint updated to /api/auth/signup
      const res = await fetch(`${apiUrl}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Successful response handling
        router.push({
          pathname: "/(authentication)/verifyotp",
          params: { email: data.user?.email || formData.email },
        });
      } else {
        // Handle Server Status Codes (400, 404, 500)
        if (res.status === 400 && data.field) {
          setErrors({ [data.field]: data.message });
        } else if (res.status === 404) {
          setModalConfig({
            visible: true,
            type: "error",
            title: "Endpoint Error (404)",
            message:
              "Authentication server route not found. Check server configuration.",
          });
        } else if (res.status === 500) {
          setModalConfig({
            visible: true,
            type: "error",
            title: "Server Failure (500)",
            message:
              "Internal server error. Please try again in a few moments.",
          });
        } else {
          setModalConfig({
            visible: true,
            type: "error",
            title: "Signup Failed",
            message:
              data.message || "Unable to complete registration. Try again.",
          });
        }
      }
    } catch (err) {
      setModalConfig({
        visible: true,
        type: "error",
        title: "Connection Error",
        message:
          "Network request failed. Please check your internet connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Top Header Section */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        className="px-6 pt-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className=" flex-row mt-10 mb-20 items-center justify-between relative">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            className="w-10 h-10 rounded-full bg-red-600 items-center justify-center shadow-md shadow-red-300 z-10"
          >
            <ArrowLeft size={20} color="#ffffff" />
          </TouchableOpacity>

          {/* Center App Logo */}
          <View className="absolute left-0 right-0 items-center justify-center">
            <Image
              source={require("../../assets/blood-donation-logo.jpeg")} // <-- Update with your app logo path
              style={{ width: 90, height: 90, borderRadius: 50 }}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Input Fields with Floating Labels */}
        <FloatingLabelInput
          label="Full Name"
          value={formData.name}
          onChangeText={(t) => {
            setFormData({ ...formData, name: t });
            if (errors.name) setErrors({ ...errors, name: null });
          }}
          icon={User}
          error={errors.name}
        />

        <FloatingLabelInput
          label="Email Address"
          value={formData.email}
          onChangeText={(t) => {
            setFormData({ ...formData, email: t });
            if (errors.email) setErrors({ ...errors, email: null });
          }}
          icon={Mail}
          keyboardType="email-address"
          error={errors.email}
        />

        <FloatingLabelInput
          label="Password"
          value={formData.password}
          onChangeText={(t) => {
            setFormData({ ...formData, password: t });
            if (errors.password) setErrors({ ...errors, password: null });
          }}
          icon={Lock}
          secureTextEntry={!showPassword}
          rightIcon={showPassword ? EyeOff : Eye}
          onRightIconPress={() => setShowPassword(!showPassword)}
          error={errors.password}
        />

        {/* Action Button */}
        <View className="mt-2">
          <GradientButton title="Sign Up" onPress={handleSignUp} />
        </View>

        {/* Divider */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-[1px] bg-slate-100" />
          <AppText className="px-4 text-slate-400 text-xs uppercase tracking-widest font-bold">
            Or Register With
          </AppText>
          <View className="flex-1 h-[1px] bg-slate-100" />
        </View>

        {/* Google OAuth Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="w-full flex-row items-center justify-center h-16 border-2 border-slate-100 rounded-[30px] bg-slate-50/50 mb-8"
        >
          <UserCheck size={22} color="#dc2626" />
          <AppText variant="bold" className="ml-3 text-slate-700 text-base">
            Continue with Google
          </AppText>
        </TouchableOpacity>

        {/* Footer Link */}
        <View className="flex-row justify-center items-center">
          <AppText variant="medium" className="text-slate-500">
            Already have an account?{" "}
          </AppText>
          <TouchableOpacity
            onPress={() => router.push("/(authentication)/login")}
          >
            <AppText variant="black" className="text-red-600 underline">
              Log In
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      <LoadingOverlay visible={loading} message="Creating your account..." />

      {/* Status Modal Popup */}
      <StatusModal
        visible={modalConfig.visible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={closeModal}
      />
    </SafeAreaView>
  );
}
