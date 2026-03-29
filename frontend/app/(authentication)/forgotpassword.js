import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  KeyRound,
  Mail,
  ShieldCheck,
  Lock,
} from "lucide-react-native";
import { MotiView } from "moti";
import AppText from "../../components/AppText";

const apiUrl =
  Platform.OS === "web"
    ? "http://localhost:5000"
    : process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.xx:5000";

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSendOtp = async () => {
    if (!formData.email) {
      setErrors({ email: "Email is required" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert("Success", "OTP sent to your email!");
        setStep(2);
      } else {
        setErrors({ email: data.message });
      }
    } catch (err) {
      Alert.alert("Error", "Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    let newErrors = {};
    if (!formData.otp) newErrors.otp = "OTP is required";
    if (!formData.newPassword) newErrors.password = "New Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert("Success", "Password reset successfully! Please login.");
        router.replace("/login");
      } else {
        setErrors({ general: data.message });
      }
    } catch (err) {
      Alert.alert("Error", "Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 pt-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-6 w-10 h-10 items-center justify-center rounded-full bg-slate-50"
        >
          <ArrowLeft size={20} color="#64748b" />
        </TouchableOpacity>

        <View className="items-center lg:items-start mb-8">
          <View className="size-16 bg-red-50 rounded-2xl items-center justify-center mb-6">
            <KeyRound size={32} color="#dc2626" />
          </View>
          <AppText variant="heading" className="text-3xl text-center lg:text-left">
            {step === 1 ? "Forgot Password?" : "Reset Password"}
          </AppText>
          <AppText className="text-slate-500 mt-2 text-center lg:text-left">
            {step === 1
              ? "Don't worry! Enter your email to receive a secure reset code."
              : "Enter the 6-digit code and your new password below."}
          </AppText>
        </View>

        <View className="space-y-5">
          {step === 1 ? (
            <MotiView from={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <AppText variant="medium" className="mb-2">Registered Email</AppText>
              <View className={`flex-row items-center border rounded-xl px-4 py-4 ${errors.email ? "border-red-500 bg-red-50" : "border-slate-200 bg-slate-50"}`}>
                <Mail size={20} color={errors.email ? "#ef4444" : "#64748b"} />
                <TextInput
                  className="flex-1 ml-3 text-slate-900 font-inter"
                  style={Platform.OS === 'web' ? { outlineStyle: 'none' } : {}}
                  selectionColor="#ef4444"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChangeText={(text) => {
                    setFormData({ ...formData, email: text });
                    if(errors.email) setErrors({});
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              {errors.email && <AppText variant="error" className="mt-1">{errors.email}</AppText>}
            </MotiView>
          ) : (
            <MotiView from={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              {/* OTP Input */}
              <View className="mb-5">
                <AppText variant="medium" className="mb-2">6-Digit OTP</AppText>
                <View className={`flex-row items-center border rounded-xl px-4 py-4 ${errors.otp ? "border-red-500 bg-red-50" : "border-slate-200 bg-slate-50"}`}>
                  <ShieldCheck size={20} color={errors.otp ? "#ef4444" : "#64748b"} />
                  <TextInput
                    className="flex-1 ml-3 text-slate-900 font-inter"
                    style={Platform.OS === 'web' ? { outlineStyle: 'none' } : {}}
                    selectionColor="#ef4444"
                    placeholder="Enter Code"
                    keyboardType="number-pad"
                    maxLength={6}
                    onChangeText={(text) => {
                      setFormData({ ...formData, otp: text });
                      if(errors.otp) setErrors({...errors, otp: null});
                    }}
                  />
                </View>
                {errors.otp && <AppText variant="error" className="mt-1">{errors.otp}</AppText>}
              </View>

              {/* New Password Input */}
              <View>
                <AppText variant="medium" className="mb-2">New Password</AppText>
                <View className={`flex-row items-center border rounded-xl px-4 py-4 ${errors.password ? "border-red-500 bg-red-50" : "border-slate-200 bg-slate-50"}`}>
                  <Lock size={20} color={errors.password ? "#ef4444" : "#64748b"} />
                  <TextInput
                    className="flex-1 ml-3 text-slate-900 font-inter"
                    style={Platform.OS === 'web' ? { outlineStyle: 'none' } : {}}
                    selectionColor="#ef4444"
                    placeholder="Min. 6 characters"
                    secureTextEntry
                    onChangeText={(text) => {
                      setFormData({ ...formData, newPassword: text });
                      if(errors.password) setErrors({...errors, password: null});
                    }}
                  />
                </View>
                {errors.password && <AppText variant="error" className="mt-1">{errors.password}</AppText>}
              </View>
            </MotiView>
          )}

          {errors.general && <AppText variant="error" className="text-center">{errors.general}</AppText>}

          <TouchableOpacity
            onPress={step === 1 ? handleSendOtp : handleReset}
            disabled={loading}
            className="w-full bg-red-600 h-16 rounded-2xl items-center justify-center mt-6 shadow-xl shadow-red-200"
          >
            {loading ? <ActivityIndicator color="white" /> : (
              <AppText className="text-white font-black uppercase tracking-widest">
                {step === 1 ? "Get Reset Code" : "Update Password"}
              </AppText>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}