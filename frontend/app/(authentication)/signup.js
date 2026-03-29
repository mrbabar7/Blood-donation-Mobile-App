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
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserRoundCheck,
} from "lucide-react-native";
import AppText from "../../components/AppText";

const apiUrl =
  Platform.OS === "web"
    ? "http://localhost:5000"
    : process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.xx:5000";

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

  const handleSignUp = async () => {
    let newErrors = {};

    if (!formData.name) {
      newErrors.name = "Full Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch(`${apiUrl}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        Alert.alert("Success", "Please verify your email address!");
        router.push({
          pathname: "/verifyotp",
          params: { email: formData.email },
        });
      } else {
        if (data.field) {
          setErrors({ [data.field]: data.message });
        } else {
          setErrors({ general: data.message });
        }
      }
    } catch (err) {
      setErrors({ general: "Server error. Please check your connection." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white/90">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 pt-6 ">
        <View className="mb-8 items-center"> 
          <AppText variant="heading" className="text-4xl text-center">
            Create Account
          </AppText>
          <AppText className="text-slate-500 mt-2 text-center">
            Join our community of blood donors.
          </AppText>
        </View>

        <View className="space-y-4">
          {/* Full Name Input */}
          <View>
            <AppText variant="medium" className="mb-2">Full Name</AppText>
            <View className={`flex-row items-center border rounded-xl px-4 py-3 ${errors.name ? "border-red-500 bg-red-50" : "border-slate-200 bg-slate-50"}`}>
              <User size={20} color={errors.name ? "#ef4444" : "#64748b"} />
              <TextInput
                className="flex-1 ml-3 text-slate-900 font-inter"
                style={Platform.OS === 'web' ? { outlineStyle: 'none' } : {}}
                selectionColor="#ef4444"
                placeholder="John Doe"
                value={formData.name}
                onChangeText={(text) => {
                  setFormData({ ...formData, name: text });
                  if(errors.name) setErrors({...errors, name: null});
                }}
              />
            </View>
            {errors.name && <AppText variant="error" className="mt-1 text-xs">{errors.name}</AppText>}
          </View>

          {/* Email Input */}
          <View className="mt-4">
            <AppText variant="medium" className="mb-2">Email Address</AppText>
            <View className={`flex-row items-center border rounded-xl px-4 py-3 ${errors.email ? "border-red-500 bg-red-50" : "border-slate-200 bg-slate-50"}`}>
              <Mail size={20} color={errors.email ? "#ef4444" : "#64748b"} />
              <TextInput
                className="flex-1 ml-3 text-slate-900 font-inter"
                style={Platform.OS === 'web' ? { outlineStyle: 'none' } : {}}
                selectionColor="#ef4444"
                placeholder="name@example.com"
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({ ...formData, email: text });
                  if(errors.email) setErrors({...errors, email: null});
                }}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            {errors.email && <AppText variant="error" className="mt-1 text-xs">{errors.email}</AppText>}
          </View>

          {/* Password Input */}
          {/* Password Input Section */}
<View className="mt-4">
  <AppText variant="medium" className="mb-2">Password</AppText>
  <View className={`flex-row items-center border rounded-xl px-4 py-3 ${errors.password ? "border-red-500 bg-red-50" : "border-slate-200 bg-slate-50"}`}>
    <Lock size={20} color={errors.password ? "#ef4444" : "#64748b"} />
    <TextInput
      className="flex-1 ml-3 text-slate-900 font-inter"
      style={Platform.OS === 'web' ? { outlineStyle: 'none' } : {}}
      selectionColor="#ef4444"
      placeholder="••••••••"
      secureTextEntry={!showPassword}
      value={formData.password}
      onChangeText={(text) => {
        setFormData({ ...formData, password: text });
        if(errors.password) setErrors({...errors, password: null});
      }}
    />
    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
      {/* YAHAN FIX KIYA HAI - Closing tag missing tha */}
      {showPassword ? (
        <EyeOff size={20} color="#64748b" />
      ) : (
        <Eye size={20} color="#64748b" /> 
      )}
    </TouchableOpacity>
  </View>
  {errors.password && <AppText variant="error" className="mt-1 text-xs">{errors.password}</AppText>}
</View>

          {errors.general && (
            <AppText variant="error" className="mt-4 text-center">{errors.general}</AppText>
          )}

          <TouchableOpacity
            onPress={handleSignUp}
            disabled={loading}
            className="w-full bg-red-600 h-14 rounded-2xl items-center justify-center mt-6 shadow-lg shadow-red-100"
          >
            {loading ? <ActivityIndicator color="white" /> : <AppText className="text-white font-bold text-lg">Sign Up</AppText>}
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center my-8">
          <View className="flex-1 h-[1px] bg-slate-200" />
          <AppText className="px-4 text-slate-400 text-sm uppercase tracking-widest">Or register with</AppText>
          <View className="flex-1 h-[1px] bg-slate-200" />
        </View>

        <TouchableOpacity className="w-full flex-row items-center justify-center h-14 border border-slate-200 rounded-2xl bg-white mb-6">
          <UserRoundCheck size={22} color="#DB4437" />
          <AppText variant="medium" className="ml-3">Google</AppText>
        </TouchableOpacity>

        <View className="flex-row justify-center pb-10">
          <AppText>Already have an account? </AppText>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <AppText className="text-red-600 font-bold underline">Log In</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}