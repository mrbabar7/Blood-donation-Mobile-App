import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Mail,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react-native";
import { MotiView } from "moti";
import FloatingLabelInput from "../components/ui/FloatingLabelInput";
import GradientButton from "../components/ui/GradientButton";
import StatusModal from "../components/ui/StatusModal";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import AppText from "../../components/AppText";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [modalConfig, setModalConfig] = useState({
    visible: false,
    type: "error",
    title: "",
    message: "",
    onClose: null,
  });

  const closeModal = () => {
    if (modalConfig.onClose) {
      modalConfig.onClose();
    }
    setModalConfig((prev) => ({ ...prev, visible: false, onClose: null }));
  };

  const handleSendOtp = async () => {
    let newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email ending in .com, .pk, etc.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setModalConfig({
          visible: true,
          type: "success",
          title: "Code Sent",
          message: "A 6-digit verification code has been sent to your email.",
          onClose: () => setStep(2),
        });
      } else {
        if (data.field) {
          setErrors({ [data.field]: data.message });
        } else {
          setModalConfig({
            visible: true,
            type: "error",
            title: "Request Failed",
            message:
              data.message || "Failed to send reset code. Please try again.",
          });
        }
      }
    } catch (err) {
      setModalConfig({
        visible: true,
        type: "error",
        title: "Connection Error",
        message: "Check your internet connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    let newErrors = {};

    if (!formData.otp.trim()) {
      newErrors.otp = "Verification code is required";
    } else if (formData.otp.trim().length < 6) {
      newErrors.otp = "OTP must be 6 digits";
    }

    if (!formData.newPassword) {
      newErrors.password = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch(`${apiUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          otp: formData.otp.trim(),
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setModalConfig({
          visible: true,
          type: "success",
          title: "Password Updated",
          message: "Your password has been reset successfully. Please log in.",
          onClose: () => router.replace("/(authentication)/login"),
        });
      } else {
        if (data.field) {
          setErrors({ [data.field]: data.message });
        } else {
          setModalConfig({
            visible: true,
            type: "error",
            title: "Reset Failed",
            message: data.message || "Invalid or expired verification code.",
          });
        }
      }
    } catch (err) {
      setModalConfig({
        visible: true,
        type: "error",
        title: "Connection Error",
        message: "Check your internet connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
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
              source={require("../../assets/forgot-two.png")} // <-- Update with your app logo path
              style={{ width: 90, height: 90, borderRadius: 50 }}
              resizeMode="contain"
            />
          </View>
        </View>

        <View className="mb-8">
          <AppText variant="medium" className="text-slate-400 text-sm">
            {step === 1
              ? "Enter your email address to receive a verification code."
              : "Enter the 6-digit code sent to your email and your new password."}
          </AppText>
        </View>

        {step === 1 ? (
          <MotiView
            from={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "timing", duration: 250 }}
          >
            <FloatingLabelInput
              label="Registered Email"
              value={formData.email}
              onChangeText={(t) => {
                setFormData((prev) => ({ ...prev, email: t }));
                if (errors.email)
                  setErrors((prev) => ({ ...prev, email: null }));
              }}
              icon={Mail}
              keyboardType="email-address"
              error={errors.email}
            />

            <View className="mt-2">
              <GradientButton title="Get Reset Code" onPress={handleSendOtp} />
            </View>
          </MotiView>
        ) : (
          <MotiView
            from={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "timing", duration: 250 }}
          >
            <FloatingLabelInput
              label="6-Digit Code"
              value={formData.otp}
              onChangeText={(t) => {
                setFormData((prev) => ({ ...prev, otp: t }));
                if (errors.otp) setErrors((prev) => ({ ...prev, otp: null }));
              }}
              icon={ShieldCheck}
              keyboardType="number-pad"
              error={errors.otp}
            />

            <FloatingLabelInput
              label="New Password"
              value={formData.newPassword}
              onChangeText={(t) => {
                setFormData((prev) => ({ ...prev, newPassword: t }));
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: null }));
              }}
              icon={Lock}
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconPress={() => setShowPassword(!showPassword)}
              error={errors.password}
            />

            <View className="mt-2">
              <GradientButton title="Update Password" onPress={handleReset} />
            </View>

            <TouchableOpacity
              onPress={() => setStep(1)}
              className="mt-6 items-center"
            >
              <AppText variant="bold" className="text-slate-500 text-sm">
                Didn't receive code?{" "}
                <AppText variant="black" className="text-red-600 underline">
                  Resend
                </AppText>
              </AppText>
            </TouchableOpacity>
          </MotiView>
        )}
      </ScrollView>

      <LoadingOverlay
        visible={loading}
        message={step === 1 ? "Sending code..." : "Updating password..."}
      />

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
