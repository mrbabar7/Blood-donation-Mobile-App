import React, { useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";
import Exact3DRubyDrop from "../components/Exact3DRubyDrop";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();
  const progressBarWidth = width * 0.45;

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.replace("/home");
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <View className="flex-1 bg-white items-center justify-center px-8">
      <StatusBar style="dark" />
      <MotiView
        from={{ opacity: 0, scale: 0.5, translateY: 20 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{ type: "spring", damping: 12 }}
        className="items-center justify-center"
      >
        <View style={{ width: 90, height: 120 }}>
          <Exact3DRubyDrop />
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 800, delay: 800 }}
      >
        <Text className="text-[26px] font-bold text-[#333333] mb-5">
          Blood Donation
        </Text>
      </MotiView>

      <View
        style={{ width: progressBarWidth }}
        className="h-[6px] bg-gray-100 rounded-full overflow-hidden"
      >
        <MotiView
          from={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            type: "timing",
            duration: 3500,
            delay: 1200,
          }}
          style={{
            flex: 1,
            transform: [{ scaleX: 1 }],
          }}
          className="origin-left h-full"
        >
          <LinearGradient
            colors={["#D31027", "#930B1C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </MotiView>
      </View>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 1000, delay: 3000 }}
        style={{
          position: "absolute",
          bottom: 80,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text className="text-[15px] text-gray-500 font-medium text-center px-4">
          Connecting Heroes, Saving Lives.
        </Text>
        <Text className="text-[12px] text-gray-400 mt-1">Since 2026.</Text>
      </MotiView>
    </View>
  );
}
