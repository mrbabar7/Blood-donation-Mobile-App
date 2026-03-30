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

const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.xx:5000";

export default function LogIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem("loggedInUser");
      if (user) router.replace("/home");
    };
    checkUser();
  }, []);

  const handleLogin = async () => {
    let newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 digits";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
        router.replace("/home");
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
    <SafeAreaView className="flex-1 bg-white/90">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6 pt-10"
      >
        <View className="mb-10 items-center justify-center">
          <AppText variant="heading" className="text-4xl">
            Welcome Back
          </AppText>
          <AppText className="text-slate-500 mt-2">
            Please enter your details to login.
          </AppText>
        </View>

        <View className="space-y-4">
          <View>
            <AppText variant="medium" className="mb-2">
              Email Address
            </AppText>
            <View
              className={`flex-row items-center border rounded-xl px-4 py-3 ${errors.email ? "border-red-500 bg-red-50" : "border-slate-200 bg-slate-50"}`}
            >
              <Mail size={20} color={errors.email ? "#ef4444" : "#64748b"} />
              <TextInput
                className="flex-1 ml-3 text-slate-900 font-inter"
                style={{ outlineStyle: "none" }}
                selectionColor="#ef4444"
                placeholder="name@email.com"
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({ ...formData, email: text });
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            {errors.email && (
              <AppText className="text-red-500 text-xs mt-1 ml-1">
                {errors.email}
              </AppText>
            )}
          </View>

          <View className="mt-4">
            <AppText variant="medium" className="mb-2">
              Password
            </AppText>
            <View
              className={`flex-row items-center border rounded-xl px-4 py-3 ${errors.password ? "border-red-500 bg-red-50" : "border-slate-200 bg-slate-50"}`}
            >
              <Lock size={20} color={errors.password ? "#ef4444" : "#64748b"} />
              <TextInput
                className="flex-1 ml-3 text-slate-900 font-inter"
                style={{ outlineStyle: "none" }}
                selectionColor="#ef4444"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(text) => {
                  setFormData({ ...formData, password: text });
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#64748b" />
                ) : (
                  <Eye size={20} color="#64748b" />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && (
              <AppText className="text-red-500 text-xs mt-1 ml-1">
                {errors.password}
              </AppText>
            )}

            <TouchableOpacity
              onPress={() => router.push("/forgotpassword")}
              style={{ alignSelf: "flex-end" }}
              className="mt-2"
            >
              <AppText
                style={{ color: "#dc2626" }}
                className="text-red-600 font-bold text-right"
              >
                Forgot Password?
              </AppText>
            </TouchableOpacity>
          </View>

          {errors.general && (
            <AppText variant="error" className="mt-2 text-center">
              {errors.general}
            </AppText>
          )}

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

        <View className="flex-row items-center my-8">
          <View className="flex-1 h-[1px] bg-slate-200" />
          <AppText className="px-4 text-slate-400 text-sm  uppercase tracking-widest">
            Or register with
          </AppText>
          <View className="flex-1 h-[1px] bg-slate-200" />
        </View>

        <TouchableOpacity
          className="w-full flex-row items-center justify-center h-14 border border-slate-200 rounded-2xl mb-6 bg-white"
          onPress={() => Alert.alert("Google Login", "Integration needed.")}
        >
          <UserRoundCheck size={22} color="#DB4437" />
          <AppText variant="medium" className="ml-3">
            Google
          </AppText>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-auto pb-10">
          <AppText>Don't have an account? </AppText>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <AppText className="text-red-600 font-bold underline">
              Create Account
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
