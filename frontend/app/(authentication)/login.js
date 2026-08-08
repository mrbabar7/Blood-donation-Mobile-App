import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  UserCheck,
} from "lucide-react-native";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import FloatingLabelInput from "../components/ui/FloatingLabelInput";
import GradientButton from "../components/ui/GradientButton";
import StatusModal from "../components/ui/StatusModal";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import AppText from "../../components/AppText";
import { useAuth } from "../../context/AuthContext";

WebBrowser.maybeCompleteAuthSession();

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function LogIn() {
  const router = useRouter();
  const { setUser, setSharedToken } = useAuth() || {};

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [modalConfig, setModalConfig] = useState({
    visible: false,
    type: "error",
    title: "",
    message: "",
  });

  const closeModal = () =>
    setModalConfig((prev) => ({ ...prev, visible: false }));

  const validateForm = () => {
    let newErrors = {};

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email ending in .com, .pk, etc.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        await SecureStore.setItemAsync("userToken", data.token);
        await SecureStore.setItemAsync("user", JSON.stringify(data.user));

        if (setUser) setUser(data.user);
        if (setSharedToken) setSharedToken(data.token);
        router.replace("/(dashboard)");
      } else {
        if (data.notVerified) {
          setModalConfig({
            visible: true,
            type: "warning",
            title: "Email Unverified",
            message: "Please verify your email address to continue.",
          });
          router.push({
            pathname: "/(authentication)/verifyotp",
            params: { email: formData.email },
          });
        } else if (data.field) {
          setErrors({ [data.field]: data.message });
        } else if (res.status === 404) {
          setModalConfig({
            visible: true,
            type: "error",
            title: "Endpoint Error (404)",
            message: "Authentication endpoint route not found.",
          });
        } else if (res.status === 500) {
          setModalConfig({
            visible: true,
            type: "error",
            title: "Server Error (500)",
            message: "Internal server issue. Please try again later.",
          });
        } else {
          setModalConfig({
            visible: true,
            type: "error",
            title: "Login Failed",
            message: data.message || "Invalid credentials provided.",
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

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const redirectUri = Linking.createURL("google-auth-success");
      const googleAuthUrl = `${apiUrl}/api/auth/google?platform=mobile&redirect_uri=${encodeURIComponent(
        redirectUri,
      )}`;

      const result = await WebBrowser.openAuthSessionAsync(
        googleAuthUrl,
        redirectUri,
      );

      if (result.type === "success" && result.url) {
        const { queryParams } = Linking.parse(result.url);

        if (queryParams?.token && queryParams?.user) {
          try {
            const userObj =
              typeof queryParams.user === "string"
                ? JSON.parse(queryParams.user)
                : queryParams.user;

            await SecureStore.setItemAsync("userToken", queryParams.token);
            await SecureStore.setItemAsync("user", JSON.stringify(userObj));

            if (setUser) setUser(userObj);

            router.replace("/(dashboard)");
          } catch (parseError) {
            setModalConfig({
              visible: true,
              type: "error",
              title: "Parsing Error",
              message: "Could not process Google user profile data.",
            });
          }
        } else {
          setModalConfig({
            visible: true,
            type: "error",
            title: "Authentication Failed",
            message: "Could not complete Google Login process.",
          });
        }
      }
    } catch (error) {
      setModalConfig({
        visible: true,
        type: "error",
        title: "Google Auth Error",
        message: "Something went wrong during Google Login.",
      });
    } finally {
      setGoogleLoading(false);
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
              source={require("../../assets/blood-donation-logo.jpeg")} // <-- Update with your app logo path
              style={{ width: 90, height: 90, borderRadius: 50 }}
              resizeMode="contain"
            />
          </View>
        </View>

        <FloatingLabelInput
          label="Email Address"
          value={formData.email}
          onChangeText={(t) => {
            setFormData((prev) => ({ ...prev, email: t }));
            if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
          }}
          icon={Mail}
          keyboardType="email-address"
          error={errors.email}
        />

        <View>
          <FloatingLabelInput
            label="Password"
            value={formData.password}
            onChangeText={(t) => {
              setFormData((prev) => ({ ...prev, password: t }));
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: null }));
            }}
            icon={Lock}
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? EyeOff : Eye}
            onRightIconPress={() => setShowPassword(!showPassword)}
            error={errors.password}
          />

          <TouchableOpacity
            onPress={() => router.push("/forgotpassword")}
            className="-mt-3 mb-6 align-self-end"
            style={{ alignSelf: "flex-end" }}
          >
            <AppText variant="bold" className="text-red-600 text-sm">
              Forgot Password?
            </AppText>
          </TouchableOpacity>
        </View>

        <GradientButton title="Log In" onPress={handleLogin} />

        <View className="flex-row items-center my-6">
          <View className="flex-1 h-[1px] bg-slate-100" />
          <AppText className="px-4 text-slate-400 text-xs uppercase tracking-widest font-bold">
            Or Login With
          </AppText>
          <View className="flex-1 h-[1px] bg-slate-100" />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex-row items-center justify-center h-16 border-2 border-slate-100 rounded-[30px] bg-slate-50/50 mb-8"
        >
          <UserCheck size={22} color="#dc2626" />
          <AppText variant="bold" className="ml-3 text-slate-700 text-base">
            Continue with Google
          </AppText>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center">
          <AppText variant="medium" className="text-slate-500">
            Don't have an account?{" "}
          </AppText>
          <TouchableOpacity
            onPress={() => router.push("/(authentication)/signup")}
          >
            <AppText variant="black" className="text-red-600 underline">
              Create Account
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <LoadingOverlay
        visible={loading || googleLoading}
        message={googleLoading ? "Connecting Google..." : "Logging in..."}
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
