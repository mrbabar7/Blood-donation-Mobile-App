import React, { useEffect } from "react";
import { View, ActivityIndicator, Dimensions, Text } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MotiView, MotiText } from "moti"; // <--- The animation magic
import AppText from "../components/AppText";
import { LinearGradient } from "expo-linear-gradient"; // Optional, but makes it look professional

const { width } = Dimensions.get("window");

// A professional Blood Drop SVG or View representation
const BloodDropIcon = () => (
  <View className="relative w-24 h-24">
    {/* A stylized, geometric blood drop */}
    <LinearGradient
      colors={["#ff4d4d", "#ff1a1a"]} // Subtle gradient for professional depth
      start={[0, 0]}
      end={[0.5, 1]}
      className="absolute bottom-0 w-24 h-24 rounded-full rounded-t-none rounded-br-none rotate-[20deg]"
      style={{
        transform: [{ scaleY: 1.1 }], // Stretch the drop slightly
        borderTopRightRadius: width * 0.1, // Pointy top
        borderBottomLeftRadius: width * 0.1, // Pointy top
      }}
    />
    {/* Minimalist glare effect to add dimension */}
    <View className="absolute top-4 right-5 w-5 h-5 bg-white opacity-20 rounded-full" />
  </View>
);

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Wait for the animation + brief extra pause (3.5 seconds total)
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-white items-center justify-center px-10">
      <StatusBar style="dark" />

      {/* 1. Animate the Blood Icon (Fade in from below) */}
      <MotiView
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 1000, delay: 200 }} // Smooth timing, slightly delayed
      >
        <BloodDropIcon />
      </MotiView>

      {/* 2. Animate the App Name (Sequential fade-in after icon) */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 800, delay: 1200 }} // Wait for icon, then fade
        className="mt-10 items-center"
      >
        <Text className="text-slate-900 text-2xl font-extrabold">
          Blood Donation
        </Text>
      </MotiView>

      {/* 3. Animate the Slogan (Sequential fade-in after name) */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 800, delay: 1800 }} // Wait for name, then fade
        className="mt-2 items-center"
      >
        <AppText variant="caption" className="text-red-600 font-bold">
          Save Lives • Give Blood
        </AppText>
      </MotiView>

      {/* 4. Small, modern loader that appears at the very end */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 500, delay: 2800 }}
        className="absolute bottom-20"
      >
        <ActivityIndicator size="small" color="#e11d48" />
      </MotiView>
    </View>
  );
}
