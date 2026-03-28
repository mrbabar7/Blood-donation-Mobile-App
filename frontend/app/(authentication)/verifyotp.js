import React, { useRef, useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Droplet, Lock, RefreshCcw, ChevronLeft } from "lucide-react-native";
import AppText from "../../components/AppText";

const apiUrl =
  Platform.OS === "web"
    ? "http://localhost:5000"
    : process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.xx:5000";

export default function OTPVerify() {
  const router = useRouter();
  const { email } = useLocalSearchParams(); // Gets email from router params

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputs = useRef([]);

  useEffect(() => {
    if (!email) {
      Alert.alert("Error", "Session expired. Please sign up again.");
      router.replace("/signup");
    }
  }, [email]);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to previous input on backspace if current is empty
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
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
        Alert.alert("Success", "Email Verified! You can now log in.");
        router.replace("/login");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert("Sent", "A new code has been sent to your email.");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 pt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-slate-50"
        >
          <ChevronLeft size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-8 items-center pt-10">
        <View className="items-center mb-8">
          <View className="bg-red-50 p-4 rounded-3xl mb-4">
            <Droplet size={48} color="#dc2626" fill="#dc2626" />
          </View>
          <AppText variant="heading" className="text-2xl text-center">
            Verify Your Account
          </AppText>
          <AppText className="text-slate-500 text-center mt-2">
            Enter the 6-digit code sent to{"\n"}
            <AppText variant="medium" className="text-red-600">
              {email}
            </AppText>
          </AppText>
        </View>

        {/* OTP Input Row */}
        <View className="flex-row justify-between w-full mb-6">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              className={`w-12 h-16 border-2 rounded-2xl text-center text-xl font-bold ${
                error
                  ? "border-red-500 bg-red-50"
                  : "border-slate-200 bg-slate-50 focus:border-red-500"
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

        {error ? (
          <AppText variant="error" className="mb-6 text-center">
            {error}
          </AppText>
        ) : null}

        <TouchableOpacity
          onPress={handleVerify}
          disabled={loading}
          className="w-full bg-red-600 h-14 rounded-2xl items-center justify-center shadow-lg shadow-red-200"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <AppText className="text-white font-bold text-lg">
              Verify OTP
            </AppText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResend}
          className="flex-row items-center mt-8 gap-2"
        >
          <RefreshCcw size={16} color="#dc2626" />
          <AppText className="text-red-600 font-bold">Resend New Code</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
