import React, { useRef, useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Keyboard,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Droplet, RefreshCcw, ChevronLeft } from "lucide-react-native";
import * as SecureStore from "expo-secure-store"; // For Token Storage
import AppText from "../../components/AppText";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function OTPVerify() {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30); // 30-second resend timer
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]);

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
      Alert.alert("Session Expired", "Please start the signup process again.");
      router.replace("/signup");
    }
  }, [email]);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }

    // Auto-submit if last digit is entered
    if (value && index === 5) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move back and clear previous field
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputs.current[index - 1].focus();
      }
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      setError("Please enter the full 6-digit code");
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

      if (data.success) {
        // --- SECURE TOKEN STORAGE ---
        // Save the JWT token so the user is logged in immediately
        await SecureStore.setItemAsync("userToken", data.token);
        await SecureStore.setItemAsync("user", JSON.stringify(data.user));

        Alert.alert("Verified!", "Your account is now active.");
        router.replace("/home"); // Direct to Home
      } else {
        setError(data.message || "Invalid code. Please try again.");
        // Clear OTP boxes on failure
        setOtp(new Array(6).fill(""));
        inputs.current[0].focus();
      }
    } catch (err) {
      setError("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setTimer(60); // Reset timer to 60 seconds
        setCanResend(false);
        setOtp(new Array(6).fill(""));
        Alert.alert("Success", "A new code has been sent to your email.");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-slate-50"
        >
          <ChevronLeft size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-8 items-center pt-10">
        {/* Icon & Description */}
        <View className="items-center mb-8">
          <View className="bg-red-50 p-4 rounded-3xl mb-4">
            <Droplet size={48} color="#dc2626" fill="#dc2626" />
          </View>
          <AppText variant="heading" className="text-2xl text-center">
            Verification Code
          </AppText>
          <AppText className="text-slate-500 text-center mt-2 leading-5">
            We sent a 6-digit code to{"\n"}
            <AppText variant="medium" className="text-red-600">
              {email}
            </AppText>
          </AppText>
        </View>

        {/* OTP Input Boxes */}
        <View className="flex-row justify-between w-full mb-6">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              className={`w-12 h-16 border-2 rounded-2xl text-center text-xl font-bold ${
                error
                  ? "border-red-500 bg-red-50"
                  : "border-slate-200 bg-slate-50 focus:border-red-600"
              }`}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(value) => handleChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              placeholder="-"
              placeholderTextColor="#cbd5e1"
            />
          ))}
        </View>

        {/* Error Message */}
        {error ? (
          <AppText variant="error" className="mb-6 text-center">
            {error}
          </AppText>
        ) : null}

        {/* Verify Button */}
        <TouchableOpacity
          onPress={handleVerify}
          disabled={loading}
          className={`w-full h-14 rounded-2xl items-center justify-center shadow-lg ${
            loading ? "bg-red-400" : "bg-red-600 shadow-red-200"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <AppText className="text-white font-bold text-lg">
              Verify Account
            </AppText>
          )}
        </TouchableOpacity>

        {/* Resend Logic */}
        <TouchableOpacity
          onPress={handleResend}
          disabled={!canResend || loading}
          className="flex-row items-center mt-8 gap-2"
        >
          <RefreshCcw size={16} color={canResend ? "#dc2626" : "#94a3b8"} />
          <AppText
            className={`font-bold ${canResend ? "text-red-600" : "text-slate-400"}`}
          >
            {canResend ? "Resend New Code" : `Resend code in ${timer}s`}
          </AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
