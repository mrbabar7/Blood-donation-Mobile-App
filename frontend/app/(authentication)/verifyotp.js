import React, { useRef, useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, RefreshCcw, MailCheck } from "lucide-react-native";
import * as SecureStore from "expo-secure-store";
import { MotiView } from "moti";
import GradientButton from "../components/ui/GradientButton";
import StatusModal from "../components/ui/StatusModal";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import AppText from "../../components/AppText";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function OTPVerify() {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const inputs = useRef([]);

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

  // Timer logic for Resend OTP
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (!email) {
      setModalConfig({
        visible: true,
        type: "error",
        title: "Session Expired",
        message: "Please start the signup process again.",
        onClose: () => router.replace("/(authentication)/signup"),
      });
    }
  }, [email]);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (error) setError("");

    // Move to next input if value is entered
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // Auto-dismiss keyboard when last box is filled
    if (value && index === 5) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${apiUrl}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: fullOtp }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.token) {
          await SecureStore.setItemAsync("userToken", data.token);
        }
        if (data.user) {
          await SecureStore.setItemAsync("user", JSON.stringify(data.user));
        }

        setModalConfig({
          visible: true,
          type: "success",
          title: "Account Verified",
          message: "Your account is active. Please sign in to continue.",
          onClose: () => router.replace("/(authentication)/login"),
        });
      } else {
        setError(data.message || "Invalid code. Please try again.");
        setOtp(new Array(6).fill(""));
        inputs.current[0]?.focus();
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

  const handleResend = async () => {
    if (!canResend || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setTimer(60);
        setCanResend(false);
        setOtp(new Array(6).fill(""));
        setError("");
        setModalConfig({
          visible: true,
          type: "success",
          title: "Code Resent",
          message: "A fresh verification code has been sent to your email.",
        });
      } else {
        setModalConfig({
          visible: true,
          type: "error",
          title: "Resend Failed",
          message: data.message || "Unable to send a new code right now.",
        });
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
      <MotiView
        from={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "timing", duration: 300 }}
        className="flex-1 px-6 pt-8 "
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
              source={require("../../assets/verify-email.png")} // <-- Update with your app logo path
              style={{ width: 90, height: 90, borderRadius: 50 }}
              resizeMode="contain"
            />
          </View>
        </View>

        <AppText
          variant="medium"
          className="text-slate-400 text-center text-sm mb-8 leading-5 px-4"
        >
          Enter the 6-digit verification code sent to{"\n"}
          <AppText variant="bold" className="text-red-600">
            {email || "your email address"}
          </AppText>
        </AppText>

        {/* 6-Digit OTP Boxes */}
        <View className="flex-row justify-between w-full mb-4 px-1">
          {otp.map((digit, index) => {
            const isFocused = focusedIndex === index;
            const hasError = !!error;

            let borderClass = "border-slate-200 bg-slate-50";
            if (hasError) {
              borderClass = "border-red-500 bg-red-50";
            } else if (isFocused) {
              borderClass = "border-red-600 bg-white";
            } else if (digit) {
              borderClass = "border-slate-400 bg-white";
            }

            return (
              <TextInput
                key={index}
                ref={(el) => (inputs.current[index] = el)}
                className={`w-12 h-14 border-2 rounded-xl text-center text-xl font-bold text-slate-900 ${borderClass}`}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                onChangeText={(value) => handleChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                placeholder="-"
                placeholderTextColor="#cbd5e1"
              />
            );
          })}
        </View>

        {/* Error text */}
        {error ? (
          <AppText
            variant="medium"
            className="text-red-500 text-sm mb-6 text-center"
          >
            {error}
          </AppText>
        ) : (
          <View className="h-6 mb-2" />
        )}

        {/* Action Button */}
        <View className="w-full mt-2">
          <GradientButton title="Verify Account" onPress={handleVerify} />
        </View>

        {/* Resend Link */}
        <TouchableOpacity
          onPress={handleResend}
          disabled={!canResend || loading}
          activeOpacity={0.7}
          className="flex-row items-center mt-8 gap-2 px-4 py-2  justify-center "
        >
          <RefreshCcw size={16} color={canResend ? "#dc2626" : "#94a3b8"} />
          <AppText
            variant="bold"
            className={`text-sm ${canResend ? "text-red-600" : "text-slate-400"}`}
          >
            {canResend ? "Resend New Code" : `Resend code in ${timer}s`}
          </AppText>
        </TouchableOpacity>
      </MotiView>

      <LoadingOverlay visible={loading} message="Verifying code..." />

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
