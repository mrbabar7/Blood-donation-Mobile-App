import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserRoundCheck, Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import AppText from "../../components/AppText";

// Use your computer's IP address for local testing
const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.xx:5000";

export default function LogIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Check if user is already logged in (Equivalent to your useEffect)
  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem("loggedInUser");
      if (user) router.replace("/home");
    };
    checkUser();
  }, []);

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setErrors({ general: "Please fill in all fields" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        await AsyncStorage.setItem("loggedInUser", JSON.stringify(data.user));

        // Handle your logic for pending actions
        const pendingAction = await AsyncStorage.getItem("pending_action");
        if (pendingAction) {
          await AsyncStorage.removeItem("pending_action");
          // Navigate based on your specific app logic
          router.replace("/home");
        } else {
          router.replace("/home");
        }
      } else {
        if (data.notVerified) {
          Alert.alert("Verify Email", "Please verify your email first.");
          router.push({
            pathname: "/verifyotp",
            params: { email: formData.email },
          });
        } else {
          setErrors({ general: data.message });
        }
      }
    } catch (err) {
      setErrors({ general: "Connection failed. Check your server/IP." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6 pt-10"
      >
        {/* Header Section */}
        <View className="mb-10">
          <AppText variant="heading" className="text-4xl">
            Welcome Back
          </AppText>
          <AppText className="text-slate-500 mt-2">
            Please enter your details to login.
          </AppText>
        </View>

        {/* Form Section */}
        <View className="space-y-4">
          {/* Email Input */}
          <View>
            <AppText variant="medium" className="mb-2">
              Email Address
            </AppText>
            <View
              className={`flex-row items-center border rounded-xl px-4 py-3 ${errors.general ? "border-red-500 bg-red-50" : "border-slate-200 bg-slate-50"}`}
            >
              <Mail size={20} color="#64748b" />
              <TextInput
                className="flex-1 ml-3 text-slate-900 font-inter"
                placeholder="name@email.com"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="mt-4">
            <View className="flex-row justify-between mb-2">
              <AppText variant="medium">Password</AppText>
              <TouchableOpacity onPress={() => router.push("/forgotpassword")}>
                <AppText className="text-red-600 font-bold">Forgot?</AppText>
              </TouchableOpacity>
            </View>
            <View
              className={`flex-row items-center border rounded-xl px-4 py-3 ${errors.general ? "border-red-500 bg-red-50" : "border-slate-200 bg-slate-50"}`}
            >
              <Lock size={20} color="#64748b" />
              <TextInput
                className="flex-1 ml-3 text-slate-900 font-inter"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(text) =>
                  setFormData({ ...formData, password: text })
                }
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#64748b" />
                ) : (
                  <Eye size={20} color="#64748b" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {errors.general && (
            <AppText variant="error" className="mt-2 text-center">
              {errors.general}
            </AppText>
          )}

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="w-full bg-red-600 h-14 rounded-2xl items-center justify-center mt-8 shadow-lg shadow-red-200"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <AppText className="text-white font-bold text-lg">Login</AppText>
            )}
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View className="flex-row items-center my-8">
          <View className="flex-1 h-[1px] bg-slate-200" />
          <AppText className="px-4 text-slate-400 text-sm">
            Or continue with
          </AppText>
          <View className="flex-1 h-[1px] bg-slate-200" />
        </View>

        {/* Social Login */}
        <TouchableOpacity
          className="w-full flex-row items-center justify-center h-14 border border-slate-200 rounded-2xl bg-white"
          onPress={() =>
            Alert.alert(
              "Google Login",
              "Integration with Firebase/Auth needed for mobile.",
            )
          }
        >
          <UserRoundCheck size={22} color="#DB4437" />
          <AppText variant="medium" className="ml-3">
            Google
          </AppText>
        </TouchableOpacity>

        {/* Footer */}
        <View className="flex-row justify-center mt-auto pb-10">
          <AppText>Don't have an account? </AppText>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <AppText className="text-red-600 font-bold underline">
              Create one
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
